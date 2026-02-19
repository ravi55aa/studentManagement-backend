import { injectable } from "tsyringe";
import { INotificationRepo } from "../Interfaces/repository/INotificationRepo";
import { NotificationPayload } from "../Interfaces/services/INotificatoin";
import { INotification, notificationModel, } from "../Models/notificaitonModel";
import { BaseRepository } from "./BaseRepository";




@injectable()
export class NotificationRepo 
    extends BaseRepository<INotification> 
    implements INotificationRepo 
    {

        constructor(){
            super(notificationModel);
        }

    async addNotification(payload:NotificationPayload):Promise<INotification|null>{
        try{
            return await notificationModel.create(payload);
        } catch(err){
            throw new Error(`Cannot Send the notification ${payload}`);
        }
    }


    public async findByUser(
    userId: string,
    role: string
    ):Promise<INotification[] | []>{

        return await notificationModel
            .find({
                "sender.id":userId,
                "sender.model": role
            },{sender:0})
            .sort({ createdAt: -1 });
    }

}




/**** Notification receive repo ****/
// class UserNotificationRepo implements BaseRepository<IUserNotification>{
    
// }