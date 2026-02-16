import {Request,Response} from "express";


import { userNotificationModel } from "../Models/notificationUser.Model";

import { 
    INotificationService, 
    NotificationPayload, 
    INotificationSender } from "../Interfaces/services/INotificatoin";

import { handleValidationOF } from "../Middlewares/validateUser.middleware";
import { NotificationPayloadSchema } from "../Validators/notifications";
import { INotificationRepo } from "../Interfaces/repository/INotificationRepo";
import { Server } from "socket.io";
import { INotification } from "../Models/notificaitonModel";
import { getIO } from "../Config/socket.config";



/**
    from  -> one writer (Admin | Teacher)
    to    -> one listeners (Teacher | Student)

    Admin   -> Teacher  
    Teacher -> Student
*/



export class NotificationService implements INotificationService {

    constructor(
        private notificationRepo: INotificationRepo,
        private userNotificationService: UserNotificationService
    ) {}

    async addNotification(
        req: Request,
        res: Response
    ): Promise<boolean> {

        const payload: NotificationPayload =
        ExtractFieldsHelper.addNotification(req);

        handleValidationOF(NotificationPayloadSchema,payload,res);

        //  Enforce domain rules
        this.validatePermission(payload);

        // Save main notification
        const notification =
        await this.notificationRepo.addNotification(payload);

        if (!notification) {
        throw new Error("Failed to create notification");
        }

        // Distribute (DB + Socket)
        await this.userNotificationService.distribute(
        notification,
        payload.recipients
        );

        return true;
    }

    private validatePermission(
        payload: NotificationPayload
    ) {

        for (const r of payload.recipients) {

        if (
            payload.sender.model === "Admin" &&
            r.model !== "Teacher"
        ) {
            throw new Error(
            "Admin can only notify Teachers"
            );
        }

        if (
            payload.sender.model === "Teacher" &&
            r.model !== "Student"
        ) {
            throw new Error(
            "Teacher can only notify Students"
            );
        }
        }
    }
}


//DTO
export class ExtractFieldsHelper {
    static addNotification(req:Request){
        const {
            type,title,
            message,link,attachmentUrl,
            sender,recipients
        }:Partial<NotificationPayload>=req.body;

        const param=req.params;

        const fields= Object.keys(req.body);
        
        for(let field of fields){
            if(field == "link" || 
                field=="attachmentUrl") continue;

            if(!req.body[field]){
                throw new Error(`${field} Cannot be empty`);
            }
        }

        const updateSender={
            model:sender?.model!,
            id:param.id!
        }

        const payload:NotificationPayload = {
            type:type!,title:title!,
            message:message!,
            sender:updateSender!,
            recipients:recipients!,
            link,
            attachmentUrl
        }

        return payload;
    }
}




export class TeacherNotificationSender implements 
    INotificationSender {
    async send(payload: NotificationPayload): Promise<void> {
            // Teacher → Batch | Student only
            for (const r of payload.recipients) {
                if (!['Batch', 'Student'].includes(r.model)) 
                    {
                        throw new Error(
                            'Teacher cannot notify this target'
                        );
                }
        }
        }
}


export class AdminNotificationSender implements INotificationSender {
    async send(payload: NotificationPayload): Promise<void> {
        // Admin → Teacher | School | Center only
        for (const r of payload.recipients) {
            if (!['Teacher', 'School', 'Center'].includes(r.model)) {
                throw new Error('Admin cannot notify this target');
            }
        }
    }
}

export class UserNotificationService {

  constructor(private io: Server) {} // socket instance injected

    async distribute(
        notification: INotification,
        recipients: NotificationPayload['recipients']
    ) {
        const io=getIO();

        const bulkDocs: any[] = [];

        for (const r of recipients) {
            for (const userId of r.ids) {
                //  Save for in-app persistence
                bulkDocs.push({
                    userId,userModel: r.model,
                    notificationId: notification._id,
                    isRead: false,
                });
                
                //  Emit real-time notification
                io.to(`${r.model}-${userId}`).emit(
                    "notification:new",
                    notification
                );
            }
        }

        if (bulkDocs.length) {
            await userNotificationModel.insertMany(bulkDocs);
        }
    }
}






