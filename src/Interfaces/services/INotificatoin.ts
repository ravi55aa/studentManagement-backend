import { Request, Response } from 'express';

import { serviceReturnType } from '../../Constants/interfaces';

export interface NotificationPayload {
  type: string;
  title: string;
  message: string;
  link?: string | undefined;
  attachmentUrl?: string | undefined;

  sender: {
    model: string;
    id: string;
  };
}

export interface INotificationSender {
  send(payload: NotificationPayload): Promise<void>;
}

//------------ Service-interface
export interface INotificationService {
  addNotification(req: Request, res: Response): Promise<boolean>;

  getAllNotifications(req: Request, res: Response): Promise<serviceReturnType>;

  getUserNotifications(userId: string): Promise<serviceReturnType>;

  setUserNotificationIsRead(userNotificationId: string): Promise<serviceReturnType>;
}
