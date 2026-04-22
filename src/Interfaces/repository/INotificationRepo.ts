import { IUserNotification } from '@Models/notificationUser.Model';
import { INotification } from '@Models/notificaitonModel';

import { NotificationPayload } from '../services/INotificatoin';

export interface INotificationRepo {
  addNotification(payload: NotificationPayload): Promise<INotification | null>;

  findByUser(userId: string): Promise<INotification[] | []>;

  getUserNotifications(userId: string): Promise<IUserNotification[] | []>;

  setUserNotificationIsRead(userNotificationId: string): Promise<IUserNotification | null>;
}
