import {Request} from 'express';
import { ApiResponse } from '@Constants/apiResponse';
import { serviceReturnType } from '@Constants/interfaces';
import {
    BatchMessage,
    ChatMessage,
    CommonMessage,
    ServerMessage,
} from '@Constants/resposeMessages';
import { StatusCodes } from '@Constants/statusCodes';
import { TYPES } from '@DI/types';
import { IRealtimeService } from '@Interfaces/Other/IRealTimeSevice';
import { IBatchRepository } from '@Interfaces/repository/IBatchRepository';
import { IChatRoomRepository, IMessageRepository } from '@Interfaces/repository/IChatRepository';
import { IStudentRepository } from '@Interfaces/repository/IStudentRepository';
import {
    IChatAccessService,
    IChatRoomService,
    IMessageService,
    iSender,
} from '@Interfaces/services/IChatService';
import { chatRoomModel, IChatRoom } from '@Models/ChatModel';
import { IStudent } from '@Models/Student/studentModel';
import logger from '@Utils/logger';
import { Types } from 'mongoose';
import { inject, injectable } from 'tsyringe';

//Access Service
@injectable()
export class ChatAccessService implements IChatAccessService {
    //  Check if user can send message
    canSend(user: iSender, chat: IChatRoom): boolean {
        if (!user?.id || !chat) return false;

        //  Must be participant
        const isParticipant = chat.participants.some((p) => p.toString() === user.id.toString());

        if (!isParticipant) return false;

        return true;
    }

    //  Check if user can read messages
    canRead(user: iSender, chat: IChatRoom): boolean {
        if (!user?.id || !chat) return false;

        return chat.participants.some((p) => p.toString() === user.id.toString());
    }
    }

    // Room Service
    @injectable()
    export class ChatRoomService implements IChatRoomService {
    constructor(
        @inject(TYPES.ChatRoomRepository)
        private _chatRoomRepository: IChatRoomRepository,

        @inject(TYPES.StudentRepository)
        private _studentRepository: IStudentRepository,

        @inject(TYPES.BatchRepository)
        private _batchRepository: IBatchRepository,
    ) {}

    //  Create Direct Chat
    async createDirectChat(user1: string, user2: string): Promise<serviceReturnType> {
        try {
        if (!user1 || !user2) {
            return ApiResponse.badRequest(CommonMessage.IdNotFound);
        }

        //  Check existing chat
        const existing = await this._chatRoomRepository.findDirectChat(user1, user2);

        if (existing) {
            return ApiResponse.success(existing, ChatMessage.ChatAlreadyExists);
        }

        // Create new chat
        const newChat = await this._chatRoomRepository.createChatRoom({
            type: 'direct',
            participants: [new Types.ObjectId(user1), new Types.ObjectId(user2)],
            createdBy: new Types.ObjectId(user1),
        });

        return ApiResponse.success(newChat, ChatMessage.ChatCreated);
        } catch (error) {
        logger.error('Error creating direct chat:', error);
        return ApiResponse.internalServerError(ServerMessage.ServerError);
        }
    }

    async createBatchChat(batchId: string): Promise<serviceReturnType> {
        if (!batchId) {
        return ApiResponse.badRequest(CommonMessage.IdNotFound);
        }

        //room exist
        const existing = await this._chatRoomRepository.findOne({ type: 'batch', batchId: batchId });

        if (existing) {
        return ApiResponse.success(existing, ChatMessage.ChatAlreadyExists);
        }

        //Valid batch
        const batch = await this._batchRepository.findById(batchId); //taking one only batch teacher;

        if (!batch) {
        return ApiResponse.failure(BatchMessage.BatchNotFound);
        } else if (!batch.batchCounselor) {
        return ApiResponse.failure(BatchMessage.BatchTeacherNotFound);
        }

        //do teachers and students into one group
        const teachers = [new Types.ObjectId(batch.batchCounselor)];

        const students = await this._studentRepository.findMany({ batch: batchId });
        logger.info('students', students);

        const studentsArray = students.map((student: IStudent) => new Types.ObjectId(student._id));

        if (teachers.length <= 0 || studentsArray.length <= 0) {
        return ApiResponse.failure(ChatMessage.BatchRoomCantCreate);
        }

        const participants = [...studentsArray, ...teachers];

        // Create new room
        const newChat = await this._chatRoomRepository.createChatRoom({
        type: 'batch',
        batchId: new Types.ObjectId(batchId),
        participants: participants,
        createdBy: batch?.batchCounselor,
        });

        return ApiResponse.success(newChat, ChatMessage.ChatFetched);
    }

    // Get all chats of a user
    async getUserChats(userId: string): Promise<serviceReturnType> {
        try {
        if (!userId) {
            return ApiResponse.badRequest(CommonMessage.IdNotFound);
        }

        const chats = await this._chatRoomRepository.getUserChats(userId);

        if (!chats || chats.length === 0) {
            return ApiResponse.success([], ChatMessage.ChatRoomNotFound);
        }

        return ApiResponse.success(chats, ChatMessage.ChatFetched);
        } catch (error) {
        logger.error('Error fetching user chats:', error);
        return ApiResponse.internalServerError(ServerMessage.ServerError);
        }
    }

    //  Get chat by ID
    async getChatById(chatRoomId: string): Promise<serviceReturnType> {
        try {
        if (!chatRoomId || chatRoomId === 'undefined') {
            return ApiResponse.badRequest(CommonMessage.IdNotFound);
        }

        const chat = await this._chatRoomRepository.getChatById(chatRoomId);

        if (chat) {
            return ApiResponse.success([], ChatMessage.ChatRoomNotFound);
        }

        return ApiResponse.success(chat, ChatMessage.ChatFetched);
        } catch (error) {
        logger.error('Error fetching user chat:', error);
        return ApiResponse.internalServerError(ServerMessage.ServerError);
        }
    }

    // Update last message
    async updateLastMessage(chatRoomId: string, message: string): Promise<serviceReturnType> {
        try {
        if (!chatRoomId) {
            return ApiResponse.badRequest(CommonMessage.IdNotFound);
        }

        const updateChat = await this._chatRoomRepository.updateLastMessage(chatRoomId, message);

        if (!updateChat) {
            return ApiResponse.success([], ChatMessage.ChatRoomNotFound);
        }

        return ApiResponse.success(updateChat, ChatMessage.MessageUpdated);
        } catch (error) {
        logger.error('Error fetching user chats:', error);
        return ApiResponse.internalServerError(ServerMessage.ServerError);
        }
    }

    async addParticipant(chatRoomId: string, userId: string): Promise<serviceReturnType> {
        try {
            if (!chatRoomId || !userId) {
                return ApiResponse.badRequest(CommonMessage.IdNotFound);
            }

            await this._chatRoomRepository.addParticipant(chatRoomId, userId);

            return ApiResponse.success(null, ChatMessage.JoinedRoom);
        } catch (error) {
            logger.error('Error adding participant:', error);
            return ApiResponse.internalServerError(ServerMessage.ServerError);
        }
    }
    }

    // Message Service
@injectable()
export class ChatMessageService implements IMessageService {
    constructor(
        @inject(TYPES.ChatRoomService)
        private _chatRoomService: IChatRoomService,

        @inject(TYPES.ChatAccessService)
        private _accessService: IChatAccessService,

        @inject(TYPES.ChatMessageRepository)
        private _messageRepository: IMessageRepository,

        @inject(TYPES.SocketService)
        private _realTimeService: IRealtimeService,
    ) {}

    //  Send Message
    async sendMessage(
        sender: iSender,
        req: Request
    ): Promise<serviceReturnType> {
        try {

        const { chatRoomId, message } = req.body;


        if (!chatRoomId || !sender?.id) {
            return ApiResponse.badRequest(CommonMessage.IdNotFound);
        }
        
        if(message.trim().length>0){
            this._realTimeService.sendParallelMsg(chatRoomId, 'receiveMessage', message?.trim());
        }

        //Attachment handling
        const files = req?.files as Express.Multer.File[];

        const docs = files?.map((f) => ({
        url: f.path,
        fileName: f.filename,
        }));
        
        // const chat = await this._chatRoomService.getChatById(chatRoomId);

        const chat = await chatRoomModel.findById(chatRoomId).lean<IChatRoom>(); 
        //!DB call ,due to incorrect above logic;

        if (!chat) {
            return ApiResponse.notFound(ChatMessage.ChatRoomNotFound);
        }

        //  Permission check

        const canSend = this._accessService.canSend(sender, chat);

        // If user is not participant, add them to participants (for batch chats)

        if (!canSend) {
            const addParticipant = await this._chatRoomService.addParticipant(chatRoomId, sender.id);

            if ((!addParticipant.status as unknown as number) === StatusCodes.BAD_REQUEST) {
            return ApiResponse.internalServerError(ServerMessage.ServerError);
            }
        }

        //  Save message
        const newMessage = await this._messageRepository.createMessage({
            chatRoomId: new Types.ObjectId(chatRoomId),
            role: sender.role == 'Student' ? 'Student' : 'Teacher',
            senderId: new Types.ObjectId(sender.id),
            message,
            attachments: docs,
            readBy: [new Types.ObjectId(sender.id)],
        });

        this._realTimeService.emitToRoom(chatRoomId, 'receiveMessage', newMessage);

        //  Update last message
        await this._chatRoomService.updateLastMessage(chatRoomId, message);

        return ApiResponse.success(newMessage, ChatMessage.MessageSent);
        } catch (error) {
        logger.error('Error sending message:', error);
        return ApiResponse.internalServerError(ServerMessage.ServerError);
        }
    }

    //  Get Messages
    async getMessages(chatRoomId: string, user: iSender): Promise<serviceReturnType> {
        try {
        if (!chatRoomId || chatRoomId === 'undefined' || !user?.id) {
            return ApiResponse.badRequest(CommonMessage.IdNotFound);
        }

        // const chat = await this._chatRoomService.getChatById(chatRoomId);
        const chat = await chatRoomModel.findById(chatRoomId).lean<IChatRoom>(); 
        //!DB call ,due to incorrect above logic;

        if (!chat) {
            return ApiResponse.notFound(ChatMessage.ChatRoomNotFound);
        }

        //  Permission check
        const canRead = this._accessService.canRead(user, chat);

        if (!canRead) {
            return ApiResponse.badRequest(ChatMessage.UnauthorizedToSend);
        }

        const messages = await this._messageRepository.getMessages(chatRoomId, 50);

        return ApiResponse.success(messages, ChatMessage.MessagesFetched);
        } catch (error) {
        logger.error('Error fetching messages:', error);
        return ApiResponse.internalServerError(ServerMessage.ServerError);
        }
    }
}
