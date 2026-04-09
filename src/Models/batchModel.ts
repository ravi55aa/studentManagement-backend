//Add pre, if batch already exist, while promoting

import { model, Types, Schema, Document } from 'mongoose';

export interface IBatches extends Document {
  tenantId: Types.ObjectId | null;
  adminId: Types.ObjectId | null;

  modelType: 'School' | 'Centers';
  center: Types.ObjectId | null;

  academicYear: Types.ObjectId | null;
  batchCounselor: Types.ObjectId | null;

  name: string | null;
  code: string | null;
  status: string | null;
  course?: string | null;

  schedule: {
    endTime: string | null;
    startTime: string | null;
  };
}

const batchSchema = new Schema<IBatches>(
  {
    tenantId: {
      type: Types.ObjectId,
      ref: 'School',
      default: null,
    },

    adminId: {
      type: Types.ObjectId,
      ref: 'Admin',
      default: null,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    modelType: {
      type: String,
      enum: ['School', 'Centers'],
      default: 'School',
    },

    center: {
      type: Types.ObjectId,
      refPath: 'modelType',
      default: null,
    },

    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
    },

    course: {
      type: String,
      trim: true,
      default: 'School',
    },

    batchCounselor: {
      type: Types.ObjectId,
      ref: 'Teacher',
      default: null,
    },

    schedule: {
      startTime: {
        type: String,
        default: null,
      },
      endTime: {
        type: String,
        default: null,
      },
    },

    academicYear: {
      type: Types.ObjectId,
      ref: 'AcademicYear',
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const batchModel = model<IBatches>('Batches', batchSchema);
