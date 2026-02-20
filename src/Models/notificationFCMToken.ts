import mongoose, { Schema, Types } from 'mongoose';

const fcm_TokenSchema = new Schema({
  userId: Types.ObjectId,
  userModel: { type: String, enum: ['Teacher', 'Student'] },
  token: String,
  device: String, // android | ios | web
  isActive: { type: Boolean, default: true },
});

export const fcmModel = mongoose.model('notification_fcm', fcm_TokenSchema);
