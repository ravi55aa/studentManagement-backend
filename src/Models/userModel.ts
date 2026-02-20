import { model, Schema, Types, Document } from 'mongoose';

export interface IUser extends Document {
  name: string | null;
  email: string;
  password: string | null;
  phone?: string | null;
  profile?: null | string;
  tenantId?: string | null | Types.ObjectId;
  role?: string | null;
}

const adminSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    tenantId: {
      type: String,
      required: false,
    },

    profile: {
      type: Schema.Types.Mixed,
      default: null,
    },

    role: { type: String, default: 'admin' },
  },
  { timestamps: true },
);

const userModel = model<IUser>('Admin', adminSchema);
export default userModel;
