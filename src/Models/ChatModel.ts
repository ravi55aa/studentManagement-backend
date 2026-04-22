//ROOM - one for each convocation
import mongoose, { Schema, model, Types, Document } from 'mongoose';

import { IUploadedDoc } from './documentModel';

export type ChatRoomType = 'direct' | 'batch';

export interface IChatRoom extends Document {
  type: ChatRoomType;

  name?: string; // batch / center name

  participants: Types.ObjectId[]; // users in chat

  //  Optional relations-Only for batchRoom | centerRoom
  batchId?: Types.ObjectId;
  centerId?: Types.ObjectId;

  //  Last message optimization
  lastMessage?: string;
  lastMessageAt?: Date;

  createdBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const chatRoomSchema = new Schema<IChatRoom>(
  {
    type: {
      type: String,
      enum: ['direct', 'batch'],
      required: true,
    },

    name: {
      type: String, // for batch / center
    },

    participants: [
      {
        type: Types.ObjectId,
        role: String,
        refPath: 'participants.role', // student / teacher / admin
      },
    ],

    //  For batch chat
    batchId: {
      type: Types.ObjectId,
      ref: 'Batches',
    },

    //  For center broadcast
    centerId: {
      type: Types.ObjectId,
      ref: 'Center',
    },

    //  Last message optimization
    lastMessage: {
      type: String,
    },

    lastMessageAt: {
      type: Date,
    },

    createdBy: {
      type: Types.ObjectId,
      role: String,
      refPath: 'senderId.role',
    },
  },
  { timestamps: true },
);

export const chatRoomModel = model<IChatRoom>('ChatRoom', chatRoomSchema);

/**
 *
 *
 */

//MESSAGES-independent

export interface IMessage extends Document {
  chatRoomId: Types.ObjectId;

  role: string;
  senderId: Types.ObjectId;

  message: string;

  attachments?: IUploadedDoc[];

  readBy: Types.ObjectId[];

  isBroadcast?: boolean; // for center messages

  createdAt: Date;
  updatedAt: Date;
}

export const uploadedDocSchema = new mongoose.Schema<IUploadedDoc>(
  {
    url: { type: String, required: true },
    fileName: { type: String, required: true },
  },
  { _id: false },
);
const messageSchema = new Schema<IMessage>(
  {
    chatRoomId: {
      type: Schema.Types.ObjectId,
      ref: 'ChatRoom',
      required: true,
    },
    role: {
      type: String,
      default: 'Student',
    },
    senderId: {
      type: Schema.Types.ObjectId,
      refPath: 'role',
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    attachments: {
      type: [uploadedDocSchema],
      default: null,
    },

    //  read receipts
    readBy: [
      {
        type: Types.ObjectId,
        role: String,
        refPath: 'senderId.role',
      },
    ],

    isBroadcast: {
      type: Boolean,
      default: false, // true for center messages
    },
  },
  { timestamps: true },
);

export const messageModel = model<IMessage>('Message', messageSchema);

chatRoomSchema.index({ type: 1 });
chatRoomSchema.index({ batchId: 1 });
chatRoomSchema.index({ centerId: 1 });

messageSchema.index({ chatRoomId: 1, createdAt: -1 });
