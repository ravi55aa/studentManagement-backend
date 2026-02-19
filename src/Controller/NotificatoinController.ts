import {Request,Response,NextFunction } from "express";
import { INotificationService } from "../Interfaces/services/INotificatoin";
import { StatusCodes } from "../Constants/statusCodes";

export class NotificationController {
    private notificationService:INotificationService;

    constructor(notifySer:INotificationService){
        this.notificationService=notifySer;
    }

    async addNewNotification(req:Request,res:Response,next:NextFunction){
        try {
            const {}=await this.notificationService.addNotification(req,res);

            res
            .status(StatusCodes.CREATED)
            .json({
                success:true,
                error:null,
                message:'done',
                data:null});
        } catch(err) {
            next(err);
        }
    }


    async getAllNotification(req:Request,res:Response,next:NextFunction){
        try {
            const {status,resBody}= await this.notificationService.getAllNotifications(req,res);

            res
            .status(status)
            .json(resBody);
        } catch(err) {
            next(err);
        }
    }
}