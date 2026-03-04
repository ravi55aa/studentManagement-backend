import { injectable } from 'tsyringe';

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
}
