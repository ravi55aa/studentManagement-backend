export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'late';

import mongoose, { Schema, Document, Types } from 'mongoose';

export const StudentAttendanceSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'leave'],
    default: 'present',
  },
  remark: {
    type: String,
  },
});

export interface IAttendance extends Document {
  batchId: Types.ObjectId;
  date: Date;
  teacherId: Types.ObjectId;

  students: {
    studentId: string;
    status: AttendanceStatus;
    remark?: string;
  }[];
  isDelete: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    batchId: {
      type: Schema.Types.ObjectId,
      ref: 'Batches',
      required: true,
    },

    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },

    date: {
      type: Date,
      default: new Date(),
      required: true,
    },

    isDelete: {
      type: Boolean,
      default: false,
    },
    students: [StudentAttendanceSchema],
  },
  {
    timestamps: true,
  },
);

AttendanceSchema.index({ batchId: 1, date: 1 }, { unique: true });

const studentAttendanceModel = mongoose.model<IAttendance>('Attendance', AttendanceSchema);

export default studentAttendanceModel;
