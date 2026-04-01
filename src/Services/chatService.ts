import { ApiResponse } from "@Constants/apiResponse";
import { serviceReturnType } from "@Constants/interfaces";
import { ChatMessage, CommonMessage, ServerMessage } from "@Constants/resposeMessages";
import { TYPES } from "@DI/types";
import { IRealtimeService } from "@Interfaces/Other/IRealTimeSevice";
import { IChatRoomRepository, IMessageRepository } from "@Interfaces/repository/IChatRepository";
import { IChatAccessService, IChatRoomService, IMessageService, iSender } from "@Interfaces/services/IChatService";
import {  chatRoomModel, IChatRoom } from "@Models/ChatModel"; 
import logger from "@Utils/logger";
import { Types } from "mongoose";
import { inject,injectable } from "tsyringe";


//Access Service
@injectable()
export class ChatAccessService implements IChatAccessService {

  //  Check if user can send message
    canSend(user: iSender, chat: IChatRoom): boolean {
        if (!user?.id || !chat) return false;

        //  Must be participant
        const isParticipant = chat.participants.some(
        (p) => p.toString() === user.id.toString()
        );

        if (!isParticipant) return false;

        //  Center chat restriction
        if (chat.type === "center" && user.role === "Student") {
        return false;
        }

        return true;
    }

    //  Check if user can read messages
    canRead(user: iSender, chat: IChatRoom): boolean {
        if (!user?.id || !chat) return false;

        return chat.participants.some(
        (p) => p.toString() === user.id.toString()
        );
    }
}

// Room Service
@injectable()
export class ChatRoomService implements IChatRoomService {
    constructor(
        @inject(TYPES.ChatRoomRepository)
        private _chatRoomRepository: IChatRoomRepository
    ) {}

    //  Create Direct Chat
    async createDirectChat(
        user1: string,
        user2: string
    ): Promise<serviceReturnType> {
        try {
        if (!user1 || !user2) {
            return ApiResponse.badRequest(CommonMessage.IdNotFound);
        }

        //  Check existing chat
        const existing = await this._chatRoomRepository.findDirectChat(
            user1,
            user2
        );

        if (existing) {
            return ApiResponse.success(existing, ChatMessage.ChatAlreadyExists);
        }

        // Create new chat
        const newChat = await this._chatRoomRepository.createChatRoom({
            type: "direct",
            participants: [new Types.ObjectId(user1), new Types.ObjectId(user2)],
            createdBy: new Types.ObjectId(user1),
        });

        return ApiResponse.success(newChat, ChatMessage.ChatCreated);
        } catch (error) {
        logger.error("Error creating direct chat:", error);
        return ApiResponse.internalServerError(ServerMessage.ServerError);
        }
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
        logger.error("Error fetching user chats:", error);
        return ApiResponse.internalServerError(ServerMessage.ServerError);
        }
    }

    //  Get chat by ID
    async getChatById(chatRoomId: string): Promise<serviceReturnType> {
        try {
        if (!chatRoomId) {
            return ApiResponse.badRequest(CommonMessage.IdNotFound);
        }

        const chat= await this._chatRoomRepository.getChatById(chatRoomId);

        if (chat) {
            return ApiResponse.success([], ChatMessage.ChatRoomNotFound);
        }

        return ApiResponse.success(chat, ChatMessage.ChatFetched);
        } catch (error) {
        logger.error("Error fetching user chat:", error);
        return ApiResponse.internalServerError(ServerMessage.ServerError);
        }
    }

    // Update last message
    async updateLastMessage(
        chatRoomId: string,
        message: string
    ): Promise<serviceReturnType> {
        try {
        if (!chatRoomId){
            return ApiResponse.badRequest(CommonMessage.IdNotFound);
        }

        const updateChat=await this._chatRoomRepository.updateLastMessage(chatRoomId, message);

        if (!updateChat) {
            return ApiResponse.success([], ChatMessage.ChatRoomNotFound);
        }

        return ApiResponse.success(updateChat, ChatMessage.MessageUpdated);

        } catch (error) {
        logger.error("Error fetching user chats:", error);
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
        private _realTimeService: IRealtimeService
    ) {}

    //  Send Message
    async sendMessage(data: {
        chatRoomId: string;
        sender: iSender;
        message: string;
    }): Promise<serviceReturnType> {
        try {
        const { chatRoomId, sender, message } = data;

        if (!chatRoomId || !sender?.id) {
            return ApiResponse.badRequest(CommonMessage.IdNotFound);
        }

        if (!message.trim()) {
            return ApiResponse.badRequest(ChatMessage.EmptyMessage);
        }

        // const chat = await this._chatRoomService.getChatById(chatRoomId); 

        const chat=await chatRoomModel.findById(chatRoomId).lean<IChatRoom>(); //!DB call ,due to incorrect above logic;

        if (!chat) {
            return ApiResponse.notFound(ChatMessage.ChatRoomNotFound);
        }

        //  Permission check
        const canSend = this._accessService.canSend(sender,chat);

        if (!canSend) {
            return ApiResponse.forbidden(ChatMessage.UnauthorizedToSend);
        }

        //  Save message
        const newMessage = await this._messageRepository.createMessage({
            chatRoomId: new Types.ObjectId(chatRoomId),
            senderId: new Types.ObjectId(sender.id),
            message,
            readBy: [new Types.ObjectId(sender.id)],
            isBroadcast: chat.type === "center",
        });

        this._realTimeService.emitToRoom(
            chatRoomId,
            "receiveMessage",
            newMessage
        );

        //  Update last message
        await this._chatRoomService.updateLastMessage(chatRoomId, message);

        return ApiResponse.success(newMessage, ChatMessage.MessageSent);
        } catch (error) {
        logger.error("Error sending message:", error);
        return ApiResponse.internalServerError(ServerMessage.ServerError);
        }
    }

  //  Get Messages
    async getMessages(
        chatRoomId: string,
        user: iSender
    ): Promise<serviceReturnType> {
        try {
        if (!chatRoomId || !user?.id) {
            return ApiResponse.badRequest(CommonMessage.IdNotFound);
        }

        // const chat = await this._chatRoomService.getChatById(chatRoomId);
        const chat=await chatRoomModel.findById(chatRoomId).lean<IChatRoom>(); //!DB call ,due to incorrect above logic;

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
        logger.error("Error fetching messages:", error);
        return ApiResponse.internalServerError(ServerMessage.ServerError);
        }
    }
}