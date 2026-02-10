import {Request,Response} from "express";

import { teacherModel } from "../Models";
import { notificationModel } from "../Models/notificaitonModel";

import { useNotificationModel } from "../Models/notificationUser.Model";
import { 
    INotificationService, 
    NotificationPayload, 
    INotificationSender } from "../Interfaces/services/INotificatoin";
import { handleValidationOF } from "../Middlewares/validateUser.middleware";
import { NotificationPayloadSchema } from "../Validators/notifications";
import { INotificationRepo } from "../Interfaces/repository/INotificationRepo";



/**
    from  -> one writer (Admin | Teacher)
    to    -> many listeners (Teacher | School | Center | Batch | Student)

    Admin   -> Teacher | School | Center
    Teacher -> Batch | Student
*/



export class NotificationService implements INotificationService {
    constructor(
        private sender: INotificationSender,
        private userNotificationService: UserNotificationService,
        private notificationRepo: INotificationRepo
    ) {}

    async addNotification(req:Request,res:Response): Promise<boolean>{
        

        const payload=ExtractFieldsHelper.addNotification(req);
        handleValidationOF(NotificationPayloadSchema,payload,res);

        //? dtoMapping:, "payload" acting as dto;

        await this.sender.send(payload);

        //Move to Repo, db-logic
        const notification = await this.notificationRepo.addNotification(payload);

        if(!notification){
            throw new Error("Cannot create Notifications");
        }
    
        // 2️ Fan-out to users
        await this.userNotificationService.distribute(
        notification._id.toString(),
        payload.recipients
        );

        return true;
    }
}


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



//LSP AND O'TH HELPER + USING THE Polymorphism with method Overriding
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

    async distribute(
        notificationId: string,
        recipients: NotificationPayload['recipients']
    ) {
        const bulkOps = [];

        for (const r of recipients) {
        const userIds = await this.resolveUsers(r.model, r.ids);

        for (const user of userIds) {
            bulkOps.push({
            userId: user.id,
            userModel: user.model,
            notificationId,
            });
        }
        }

        await useNotificationModel.insertMany(bulkOps);
    }

    private async resolveUsers(model: string, ids: string[]) {
        // Example: Center → Teachers + Students
        if (model === 'Center') {
        const teachers = await teacherModel.find({ centerId: { $in: ids } });
        //const students = await student.find({ centerId: { $in: ids } });

        return [
            ...teachers.map(t => ({ id: t._id, model: 'Teacher' })),
            //...students.map(s => ({ id: s._id, model: 'Student' })),
        ];
        }

        // Default: direct users
        return ids.map(id => ({ id, model }));
    }

}




