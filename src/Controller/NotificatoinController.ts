import {Request,Response,NextFunction } from "express";
import { INotificationService } from "../Interfaces/services/INotificatoin";

export class NotificationController{
    private notificationService:INotificationService;

    constructor(notifySer:INotificationService){
        this.notificationService=notifySer;
    }

    async addNotification(req:Request,res:Response,next:NextFunction){
        try {

            await this.notificationService.addNotification(req,res);

            res.status(200).json({success:true,error:null,message:'done',data:null});

        } catch(err){
            next(err);
        }
    }

}