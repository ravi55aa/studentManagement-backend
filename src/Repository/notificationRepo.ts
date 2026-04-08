import { injectable } from 'tsyringe';
import { IUserNotification, userNotificationModel } from '@Models/notificationUser.Model';

import { INotificationRepo } from '../Interfaces/repository/INotificationRepo';
import { NotificationPayload } from '../Interfaces/services/INotificatoin';
import { INotification, notificationModel } from '../Models/notificaitonModel';
import logger from '../Utils/logger';

import { BaseRepository } from './BaseRepository';

@injectable()
export class NotificationRepo extends BaseRepository<INotification> implements INotificationRepo {
  constructor() {
    super(notificationModel);
  }

  async addNotification(payload: NotificationPayload): Promise<INotification | null> {
    try {
      return await this.model.create(payload);
    } catch (error) {
      logger.error('Error sending notification:', error);
      return null;
    }
  }

  async findByUser(userId: string): Promise<INotification[] | []> {
    try {
      return await this.model
        .find(
          {
            'sender.id': userId,
          },
          { sender: 0 },
        )
        .sort({ createdAt: -1 })
        .lean<INotification[]>();
    } catch (error) {
      logger.error('Error finding notifications by user:', error);
      return [];
    }
  }
  
  public async getUserNotifications(userId: string): Promise<IUserNotification[] | []> {
    try {
      return await userNotificationModel.find(
        {userId:userId},{ userModel: 0 })
        .populate('notificationId'," message type title")
        .sort({ createdAt: -1 })
        .lean<IUserNotification[]>();
    } catch (error) {
      logger.error('Error finding notifications by user:', error);
      return [];
    } 
  }

public async setUserNotificationIsRead(userNotificationId: string): Promise<IUserNotification | null> {
      try {
      return await userNotificationModel.findByIdAndUpdate(
        userNotificationId,{ $set:{isRead:true} })
        .lean<IUserNotification>();

    } catch (error) {
      logger.error('Error finding notifications by user:', error);
      return null;
    } 
  }
}
