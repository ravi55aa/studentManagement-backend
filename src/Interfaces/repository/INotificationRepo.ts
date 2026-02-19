import { INotification } from "../../Models/notificaitonModel";
import { NotificationPayload } from "../services/INotificatoin";

export interface INotificationRepo{
    addNotification(payload:NotificationPayload):Promise<INotification|null>

    findByUser(userId: string,role: string):Promise<INotification[]|[]>
}
