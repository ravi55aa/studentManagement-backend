import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';

import { StatusCodes } from '../Constants/statusCodes';
import { NotificationService } from '../Services/notificationService';
import { INotificationService } from '../Interfaces/services/INotificatoin';

@injectable()
export class NotificationController {
  constructor(
    @inject(NotificationService)
    private _notificationService: INotificationService,
  ) {}

  async addNewNotification(req: Request, res: Response, next: NextFunction) {
    try {
      await this._notificationService.addNotification(req, res);

      res.status(StatusCodes.CREATED).json({
        success: true,
        error: null,
        message: 'done',
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
}
