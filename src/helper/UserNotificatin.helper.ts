import { Types } from 'mongoose';

//import { getIO } from '../Config/socket.config';
import { IUserNotification } from '../Interfaces/Other/IUserNotification';
import { INotification } from '../Models/notificaitonModel';
import { userNotificationModel } from '../Models/notificationUser.Model';

export class UserNotificationService implements IUserNotification {
  
  async distribute(
    notification: INotification,
    recipients: {
      userId: Types.ObjectId;
      userModel: string;
    }[],
  ) {
    const bulkDocs: {
      userId: Types.ObjectId;
      userModel: string;
      notificationId: Types.ObjectId;
      isRead: boolean;
    }[] = [];

    for (const user of recipients) {
      // Save DB record
      bulkDocs.push({
        userId: user.userId,
        userModel: user.userModel,
        notificationId: notification._id,
        isRead: false,
      });

      //const io = getIO();

      // if(!io){
      //   io.to(`Admin-78hsKi67`).emit('notification:new', {
      //     type: notification.type,
      //     title: notification.title,
      //     message: notification.message,
      //     link: notification.link,
      //     attachmentUrl: notification.attachmentUrl,
      //     createdAt: notification.createdAt,
      //   });
      // };

      // Emit via socket
    }

    if (bulkDocs.length) {
      await userNotificationModel.insertMany(bulkDocs);
    }
  }
}
