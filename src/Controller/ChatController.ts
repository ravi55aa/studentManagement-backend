import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import {
    IChatRoomService,
    IMessageService,
} from "@Interfaces/services/IChatService";
import { SchoolAcademicYearDto } from "@dto/schoolDTO";

import { TYPES } from "../DI/types";

@injectable()
export default class ChatController {
    constructor(
        @inject(TYPES.ChatRoomService)
        private _chatRoomService: IChatRoomService,

        @inject(TYPES.ChatMessageService)
        private _chatMessageService: IMessageService
    ) {}

    //  Create Direct Chat
    async createDirectChat(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
        const { user1, user2 } = req.body;

        const { status, resBody } =
            await this._chatRoomService.createDirectChat(user1, user2);

        res.status(status).json(resBody);
        } catch (err) {
        next(err);
        }
    }

    //  Create Direct Chat
    async createBatchChat(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
        const { batchId } = req.body;

        const { status, resBody } =
            await this._chatRoomService.createBatchChat(batchId);

        res.status(status).json(resBody);
        } catch (err) {
        next(err);
        }
    }

    //  Get User Chats
    async getUserChats(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
        const userId = req.params.userId;

        const { status, resBody } =
            await this._chatRoomService.getUserChats(userId!);

        res.status(status).json(resBody);
        } catch (err) {
        next(err);
        }
    }

    //  Send Message
    async sendMessage(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
        const { chatRoomId, message } = req.body;

        const user=SchoolAcademicYearDto.getTenantId(req,res);

        const { status, resBody } =
            await this._chatMessageService.sendMessage({
            chatRoomId,
            sender:{id:user.adminId,role:user.role},
            message,
            });

        res.status(status).json(resBody);
        } catch (err) {
        next(err);
        }
    }

    //  Get Messages
    async getMessages(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
        const { chatRoomId } = req.params;

        const sender=SchoolAcademicYearDto.getTenantId(req,res);


        const { status, resBody } =
            await this._chatMessageService.getMessages(
            chatRoomId!,
            {id:sender.adminId,role:sender.role}
            );

        res.status(status).json(resBody);
        } catch (err) {
        next(err);
        }
    }
}