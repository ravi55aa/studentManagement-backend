import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from '../Constants/statusCodes';
import { injectable, inject } from 'tsyringe';
import { NotificationService } from '../Services/notificationService';

@injectable()
export class NotificationController {
  constructor(
    @inject(NotificationService)
    private notificationService: NotificationService,
  ) {}

  async addNewNotification(req: Request, res: Response, next: NextFunction) {
    try {
      await this.notificationService.addNotification(req, res);

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
      const { status, resBody } = await this.notificationService.getAllNotifications(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }
}
