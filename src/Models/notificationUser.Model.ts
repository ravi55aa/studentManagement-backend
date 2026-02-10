import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export enum NotifyTo {
  Teacher="Teacher",
  Student="Student",
  Admin="Admin",
}

export interface IUserNotification extends Document {
  userId: ObjectId;
  userModel: NotifyTo;

  notificationId: ObjectId;

  isRead: boolean;
  readAt?: Date;

  createdAt: Date;
}

const UserNotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'userModel',
    },

    userModel: {
      type: String,
      enum: ['Teacher', 'Student', 'Admin'],
      required: true,
    },

    notificationId: {
      type: Schema.Types.ObjectId,
      ref: 'Notification',
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const useNotificationModel = mongoose.model<IUserNotification>(
  'UserNotification',
  UserNotificationSchema
);


