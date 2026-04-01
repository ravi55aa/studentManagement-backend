import { IChatRoom,IMessage } from "@Models/ChatModel"; 
import { BaseRepository } from "@Repository/BaseRepository";

export interface IChatRoomRepository extends BaseRepository<IChatRoom> {
    createChatRoom(data: Partial<IChatRoom>): Promise<IChatRoom | null>;

    getChatById(chatRoomId: string): Promise<IChatRoom | null>;

    findDirectChat(
        user1: string,
        user2: string
    ): Promise<IChatRoom | null>;

    getUserChats(userId: string): Promise<IChatRoom[]>;

    updateLastMessage(
        chatRoomId: string,
        message: string
    ): Promise<IChatRoom | null>;

    addParticipant(
        chatRoomId: string,
        userId: string
    ): Promise<IChatRoom | null>;

    removeParticipant(
        chatRoomId: string,
        userId: string
    ): Promise<IChatRoom | null>;
}

export interface IMessageRepository extends BaseRepository<IMessage> {
    createMessage(data: Partial<IMessage>): Promise<IMessage | null>;

    getMessages(chatRoomId: string, limit?: number): Promise<IMessage[]>;

    markAsRead(messageId: string, userId: string): Promise<IMessage | null>;

    getUnreadCount(chatRoomId: string, userId: string): Promise<number>;

    markAllAsRead(chatRoomId: string, userId: string): Promise<boolean>;

    getLastMessage(chatRoomId: string): Promise<IMessage | null>;
}