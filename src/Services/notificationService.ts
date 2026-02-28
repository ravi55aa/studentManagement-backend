import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { IUserNotification } from 'Interfaces/Other/IUserNotification';

import {
  INotificationService,
  NotificationPayload,
  INotificationSender,
} from '../Interfaces/services/INotificatoin';
import { handleValidationOF } from '../Middlewares/validateUser.middleware';
import { NotificationPayloadSchema } from '../Validators/notifications';
import { teacherModel } from '../Models';
import { ApiResponse } from '../Constants/apiResponse';
import { serviceReturnType } from '../Constants/interfaces';
import { handleTokenVerification } from '../Utils/jwt';
import { NotificationDto } from '../dto/notificatoinDto';
import { NotificationRepo } from '../Repository/notificationRepo';
import { INotificationRepo } from '../Interfaces/repository/INotificationRepo';
import { UserNotificationService } from '../helper/UserNotificatin.helper';

/**
    from  -> one writer (Admin | Teacher)
    to    -> one listeners (Teacher | Student)

    Admin   -> Teacher  
    Teacher -> Student
*/


@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(NotificationRepo)
    private _notificationRepo: INotificationRepo,

    private _userNotificationService: UserNotificationService,
  ) {}

  public async addNotification(req: Request, res: Response): Promise<boolean> {
    const payload: NotificationPayload = NotificationDto.addNotification(req, res);

    handleValidationOF(NotificationPayloadSchema, payload, res);

    //  Validate sender role only
    this._validateSender(payload.sender.model);

    //  Save main notification
    const notification = await this._notificationRepo.addNotification(payload);

    if (!notification) {
      throw new Error('Failed to create notification');
    }

    //  Resolve recipients internally
    const recipients = await this._resolveRecipients(payload.sender.model);

    //  Distribute (DB + Socket)
    await this._userNotificationService.distribute(notification, recipients);

    return true;
  }

  private _validateSender(model: string) {
    if (!['Admin', 'Teacher'].includes(model)) {
      throw new Error('Invalid sender role');
    }
  }

  private async _resolveRecipients(senderModel: string) {
    if (senderModel === 'Admin') {
      const teachers = await teacherModel.find({}).select('_id').lean();

      return teachers.map((t) => ({
        userId: t._id,
        userModel: 'Teacher',
      }));
    }

    // if (senderModel === "Teacher") {
    // const students = await studentModel
    //     .find({})
    //     .select("_id")
    //     .lean();

    // return students.map((s) => ({
    //     userId: s._id,
    //     userModel: "Student",
    // }));
    // }

    return [];
  }

  public async getAllNotifications(req: Request, res: Response): Promise<serviceReturnType> {
    const decoded = handleTokenVerification(req, res);

    const userId = decoded.userId;
    const role = decoded.role;

    if (!userId || !role) {
      return ApiResponse.unAuthorized('Invalid user');
    }

    // Fetch from UserNotification table
    const notifications = await this._notificationRepo.findByUser(userId, role);

    if (!notifications.length) {
      return ApiResponse.success([]);
    }

    return ApiResponse.success(notifications);
  }
}

export class TeacherNotificationSender implements INotificationSender {
  async send(payload: NotificationPayload): Promise<void> {
    // Teacher → Batch | Student only
    if (payload.sender.model !== 'Teacher') {
      throw new Error('Invalid sender type for AdminNotificationSender');
    }
  }
}

export class AdminNotificationSender implements INotificationSender {
  async send(payload: NotificationPayload): Promise<void> {
    // Admin → Teacher | School | Center only
    if (payload.sender.model !== 'Admin') {
      throw new Error('Invalid sender type for AdminNotificationSender');
    }
  }
}
