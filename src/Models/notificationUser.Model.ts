import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export enum NotifyTo {
  Teacher = 'Teacher',
  Student = 'Student',
  Admin = 'Admin',
}

export interface IUserNotification extends Document {
  userId: ObjectId;
  userModel: NotifyTo;

  notificationId: ObjectId;

  isRead: boolean;

  createdAt: Date;
}

const UserNotificationSchema = new Schema(
  {
    userModel: {
      type: String,
      enum: ['Teacher', 'Student'],
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      refPath: 'userModel',
      required: true,
    },

    notificationId: {
      type: Schema.Types.ObjectId,
      ref: 'Notifications',
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const userNotificationModel = mongoose.model<IUserNotification>(
  'UserNotification',
  UserNotificationSchema,
);
