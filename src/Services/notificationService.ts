import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import {
  INotificationService,
  NotificationPayload,
  INotificationSender,
} from '@Interfaces/services/INotificatoin';
import { CommonMessage, NotificationMessage, ServerMessage } from '@Constants/resposeMessages';
import logger from '@Utils/logger';
import studentModel from '@Models/Student/studentModel';

import { TYPES } from '../DI/types';
import { NotificationPayloadSchema } from '../Validators/notifications';
import { teacherModel } from '../Models';
import { ApiResponse } from '../Constants/apiResponse';
import { serviceReturnType } from '../Constants/interfaces';
import { handleTokenVerification } from '../Utils/jwt';
import { NotificationDto } from '../dto/notificatoinDto';
import { INotificationRepo } from '../Interfaces/repository/INotificationRepo';
import { handleValidationOF } from '../Middlewares/validateUser.middleware';
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
    @inject(TYPES.NotificationRepository)
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
      const teachersArray = teachers.map((t) => ({
        userId: t._id,
        userModel: 'Teacher',
      }));

      const students = await studentModel.find({}).select('_id').lean();
      const studentsArray = students.map((s) => ({
        userId: s._id,
        userModel: 'Student',
      }));

      return [...teachersArray, ...studentsArray];
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
      return ApiResponse.unAuthorized(CommonMessage.IdNotFound);
    }

    // Fetch from UserNotification table
    const notifications = await this._notificationRepo.findByUser(userId);

    if (!notifications.length) {
      return ApiResponse.success([], NotificationMessage.NotificationNotFetched);
    }

    return ApiResponse.success(notifications, NotificationMessage.NotificationFetched);
  }

  public async getUserNotifications(userId: string): Promise<serviceReturnType> {
    try {
      const userNotifications = await this._notificationRepo.getUserNotifications(userId);

      if (!userNotifications || userNotifications.length <= 0) {
        return ApiResponse.failure(NotificationMessage.NotificationNotFetched);
      }

      return ApiResponse.success(userNotifications, NotificationMessage.NotificationFetched);
    } catch (error) {
      logger.error('Error while fetching user notifications:', error);
      return ApiResponse.internalServerError(ServerMessage.ServerError);
    }
  }

  public async setUserNotificationIsRead(userNotificationId: string): Promise<serviceReturnType> {
    try {
      const isRead = await this._notificationRepo.setUserNotificationIsRead(userNotificationId);

      if (!isRead) {
        return ApiResponse.failure(NotificationMessage.NotificationCantRead);
      }

      return ApiResponse.success(null, NotificationMessage.NotificationIsRead);
    } catch (error) {
      logger.error('Error while fetching user notifications:', error);
      return ApiResponse.internalServerError(ServerMessage.ServerError);
    }
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
