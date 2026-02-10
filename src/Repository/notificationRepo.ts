import { INotificationRepo } from "../Interfaces/repository/INotificationRepo";
import { NotificationPayload } from "../Interfaces/services/INotificatoin";
import { INotification, notificationModel, } from "../Models/notificaitonModel";
import { BaseRepository } from "./BaseRepository";

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

}




/**** Notification receive repo ****/
// class UserNotificationRepo implements BaseRepository<IUserNotification>{
    
// }