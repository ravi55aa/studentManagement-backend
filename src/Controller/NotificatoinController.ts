import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { ApiResponse } from '@Constants/apiResponse';
import { CommonMessage, NotificationMessage } from '@Constants/resposeMessages';
import { StatusCodes } from '@Constants/statusCodes';
import { INotificationService } from '@Interfaces/services/INotificatoin';
import { TYPES } from '@DI/types';


@injectable()
export class NotificationController {
  constructor(
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService,
  ) {}

  async addNewNotification(req: Request, res: Response, next: NextFunction) {
    try {
      await this._notificationService.addNotification(req, res);

      res.status(StatusCodes.CREATED).json({
        success: true,
        error: null,
        message: NotificationMessage.NotificationSent,
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._notificationService.getAllNotifications(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async getAllUserNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const {userId}=req.params;
    
      if(!userId || userId==null){
        const {status,resBody}=ApiResponse.notFound(CommonMessage.IdNotFound);
        return res.status(status).json(resBody);
      }

      const { status, resBody } = await this._notificationService.getUserNotifications(userId);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async readNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const {userNotificationId}=req.params;
    
      if(!userNotificationId){
        const {status,resBody}=ApiResponse.notFound(CommonMessage.IdNotFound);
        return res.status(status).json(resBody);
      }

      const { status, resBody } = await this._notificationService.setUserNotificationIsRead(userNotificationId);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

}
