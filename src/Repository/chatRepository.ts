import { IMessage,IChatRoom ,messageModel,chatRoomModel } from "@Models/ChatModel"; 
import { IMessageRepository,IChatRoomRepository } from "@Interfaces/repository/IChatRepository"; 
import { injectable } from "tsyringe";
import logger from "@Utils/logger";

import { BaseRepository } from "./BaseRepository";


/**
 * CHAT ROOM
 * 
 */

@injectable()
export class ChatRoomRepository
    extends BaseRepository<IChatRoom>
    implements IChatRoomRepository
    {
    constructor() {
        super(chatRoomModel);
    }

    //  Create Chat Room
    async createChatRoom(
        data: Partial<IChatRoom>
    ): Promise<IChatRoom | null> {
        try {
        return await this.create(data);
        } catch (error) {
        logger.error("Error creating chat room:", error);
        return null;
        }
    }

    //  Get Chat by ID
    async getChatById(chatRoomId: string): Promise<IChatRoom | null> {
        try {
        return await this.model.findById(chatRoomId).lean<IChatRoom>();
        } catch (error) {
        logger.error("Error fetching chat by ID:", error);
        return null;
        }
    }

    //  Find existing direct chat
    async findDirectChat(
        user1: string,
        user2: string
    ): Promise<IChatRoom | null> {
        try {
        return await this.model
            .findOne({
            type: "direct",
            participants: { $all: [user1, user2] },
            })
            .lean<IChatRoom>();
        } catch (error) {
        logger.error("Error finding direct chat:", error);
        return null;
        }
    }

    // Get all chats of a user
    async getUserChats(userId: string): Promise<IChatRoom[]> {
        try {
        return await this.model
            .find({ participants: userId })
            .sort({ updatedAt: -1 })
            .lean<IChatRoom[]>();
        } catch (error) {
        logger.error("Error fetching user chats:", error);
        return [];
        }
    }

    // Update last message
    async updateLastMessage(
        chatRoomId: string,
        message: string
    ): Promise<IChatRoom | null> {
        try {
        return await this.model.findByIdAndUpdate(
            chatRoomId,
            {
            lastMessage: message,
            lastMessageAt: new Date(),
            },
            { new: true }
        );
        } catch (error) {
        logger.error("Error updating last message:", error);
        return null;
        }
    }

    // Add participant (useful for group chats)
    async addParticipant(
        chatRoomId: string,
        userId: string
    ): Promise<IChatRoom | null> {
        try {
        return await this.model.findByIdAndUpdate(
            chatRoomId,
            {
            $addToSet: { participants: userId },
            },
            { new: true }
        );
        } catch (error) {
        logger.error("Error adding participant:", error);
        return null;
        }
    }

    // Remove participant
    async removeParticipant(
        chatRoomId: string,
        userId: string
    ): Promise<IChatRoom | null> {
        try {
        return await this.model.findByIdAndUpdate(
            chatRoomId,
            {
            $pull: { participants: userId },
            },
            { new: true }
        );
        } catch (error) {
        logger.error("Error removing participant:", error);
        return null;
        }
    }
}



/**
 * CHAT MESSAGE
 * 
 */
@injectable()
export class ChatMessageRepository
    extends BaseRepository<IMessage>
    implements IMessageRepository
    {
    constructor() {
        super(messageModel);
    }

    //  Create Message
    async createMessage(data: Partial<IMessage>): Promise<IMessage | null> {
        try {
        return await this.create(data);
        } catch (error) {
        logger.error("Error creating message:", error);
        return null;
        }
    }

    //  Get Messages by ChatRoom
    async getMessages(
        chatRoomId: string,
        limit?: number
    ): Promise<IMessage[]> {
        try {
        return await this.model
            .find({ chatRoomId })
            .populate('senderId','firstName name ')
            .sort({ createdAt: -1 })
            .limit(limit || 50)
            .lean<IMessage[]>();
        } catch (error) {
        logger.error("Error fetching messages:", error);
        return [];
        }
    }

    //  Mark message as read
    async markAsRead(
        messageId: string,
        userId: string
    ): Promise<IMessage | null> {
        try {
        return await this.model.findByIdAndUpdate(
            messageId,
            {
            $addToSet: { readBy: userId },
            },
            { new: true }
        );
        } catch (error) {
        logger.error("Error marking message as read:", error);
        return null;
        }
    }

    //  Get unread messages count (VERY IMPORTANT)
    async getUnreadCount(
        chatRoomId: string,
        userId: string
    ): Promise<number> {
        try {
        return await this.model.countDocuments({
            chatRoomId,
            readBy: { $ne: userId },
        });
        } catch (error) {
        logger.error("Error fetching unread count:", error);
        return 0;
        }
    }

    //  Mark all messages as read in a chat
    async markAllAsRead(
        chatRoomId: string,
        userId: string
    ): Promise<boolean> {
        try {
        await this.model.updateMany(
            {
            chatRoomId,
            readBy: { $ne: userId },
            },
            {
            $addToSet: { readBy: userId },
            }
        );

        return true;
        } catch (error) {
        logger.error("Error marking all messages as read:", error);
        return false;
        }
    }

    //  Get last message of a chat (useful for chat list)
    async getLastMessage(chatRoomId: string): Promise<IMessage | null> {
        try {
        return await this.model
            .findOne({ chatRoomId })
            .sort({ createdAt: -1 })
            .lean<IMessage>();
        } catch (error) {
        logger.error("Error fetching last message:", error);
        return null;
        }
    }
}


