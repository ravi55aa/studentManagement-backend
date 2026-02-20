import mongoose, { Schema, Document } from 'mongoose';

export interface IOtp extends Document {
  id: Schema.Types.ObjectId;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      lowercase: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

OtpSchema.index({ email: 1, purpose: 1 });

export const OtpModel = mongoose.model<IOtp>('Otp', OtpSchema);
