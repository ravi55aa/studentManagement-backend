import mongoose, { Document, ObjectId, Schema, Types } from 'mongoose';

export enum NotificationType {
    GENERAL = "GENERAL",
    ALERT = "ALERT",
    REMINDER = "REMINDER",
    ASSIGNMENT = "ASSIGNMENT",
    EXAM = "EXAM",
    EVENT = "EVENT",
    RESULT = "RESULT",
    ANNOUNCEMENT = "ANNOUNCEMENT",
    CLASS_UPDATE = "CLASS_UPDATE",
    ATTENDANCE = "ATTENDANCE",
    SYSTEM = "SYSTEM",
}


export enum NotificationStatus {
    PENDING = 'pending',
    SENT = 'sent',
    FAILED = 'failed',
    READ = 'read',
}

export interface ISender {
    model:String,
    id:String
}

export interface iRecipients {
    model:String,
    ids:ObjectId
}


export interface INotification extends Document {
    type: NotificationType;

    title: string;
    message: string;

    link?: string;
    attachmentUrl?: string;

    sender:ISender,

    createdAt: Date;
    updatedAt: Date;
}


const NotificationsSchema = new Schema<INotification>(
    {
        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: true,
        },

        title: { type: String,
            required: true,trim: true,},

        message: { type: String,
            required: true,trim: true,},

        link: {type: String},

        attachmentUrl: {type: String,},

        sender: {
            model: {
                type: String,
                enum: ['Admin', 'Teacher'],
                required: true,
            },
            id: {
                type: Schema.Types.ObjectId,
                required: true,
            },
        },

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const notificationModel = mongoose.model<INotification>("Notifications",NotificationsSchema);
