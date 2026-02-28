import { INotification } from "Models/notificaitonModel";
import { Types } from "mongoose";

export interface IUserNotification{
    distribute(
        notification: INotification
        ,
        recipients: {userId: Types.ObjectId;userModel: string}[]):void
}