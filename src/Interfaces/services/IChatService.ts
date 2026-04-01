import { IChatRoom } from "@Models/ChatModel"; 
import { serviceReturnType } from "@Constants/interfaces";

import { UserRole } from "../../types/auth.types"; 

export interface IChatAccessService {
    canSend(user: iSender, chat: IChatRoom): boolean;

    canRead(user: iSender, chat: IChatRoom): boolean;
}



/**
 * ROOM-ISERVICE
 */
export interface IChatRoomService {
    createDirectChat(
        user1: string,
        user2: string
    ): Promise<serviceReturnType>;

    getUserChats(userId: string): Promise<serviceReturnType>;

    getChatById(chatRoomId: string): Promise<serviceReturnType>;

    updateLastMessage(
        chatRoomId: string,
        message: string
    ): Promise<serviceReturnType>;
}


/**
 * MESSAGE-ISERVICE
 */
export interface iSender{ //helper
    id:string,
    role:UserRole
};
export interface ISendMessageDto { //helper
    chatRoomId: string;
    sender: iSender; 
    message: string;
}

export interface IMessageService {
    sendMessage(data: {
        chatRoomId: string;
        sender: iSender;
        message: string;
    }): Promise<serviceReturnType> ;

    getMessages(
            chatRoomId: string,
            user: iSender
        ): Promise<serviceReturnType>;
}

/**
 * OTHER
 */
export interface IUserContext {
    _id: string;
    role: "student" | "teacher" | "admin";
}