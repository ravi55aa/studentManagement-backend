import mongoose, { Schema, Document, Types } from 'mongoose';

import { Gender_types, Student_Status } from '../../types/enum';

export interface IStudent extends Document {
  admissionNumber: string | null;
  profile: string | null|undefined;
  email: string | null;
  password: string | null;
  name: string | null;
  rollNumber: string | null;
  gender: Gender_types;
  dateOfBirth: string | null;
  status: Student_Status;
  admissionDate: Date | null;
  phone: string | null;
  parentName: string | null;
  parentPhone: string | null;
  center: Types.ObjectId | null;
  tenantId: Types.ObjectId | null;
  batch: Types.ObjectId | null;
  isDeleted: boolean | null;
}

const StudentSchema = new Schema<IStudent>(
  {
    admissionNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    profile: {
      type: String,
      default: '',
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      select: false,
    },

    rollNumber: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },

    dateOfBirth: {
      type: Date,
    },

    admissionDate: {
      type: Date,
      default: Date.now,
    },

    phone: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated', 'suspended'],
      default: Student_Status.Active,
    },

    parentName: {
      type: String,
      trim: true,
    },

    parentPhone: {
      type: String,
      trim: true,
    },

    center: {
      type: Types.ObjectId,
      ref: 'Center',
      required: true,
    },

    tenantId: {
      type: Types.ObjectId,
      ref: 'School',
      required: true,
    },

    batch: {
      type: Schema.Types.ObjectId,
      ref: 'Batches',
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const studentModel = mongoose.model<IStudent>('Student', StudentSchema);

export default studentModel;
