import mongoose, { Schema, Types, Document } from 'mongoose';

interface ILeaveHistory {
  reason: string;
  body: string;
  attachment?: string;
  date: Date;
}

export interface IStudentLeave extends Document {
  //batchId: Types.ObjectId;
  studentId: Types.ObjectId;
  leaveHistory: ILeaveHistory[];
}

const LeaveHistorySchema = new Schema<ILeaveHistory>(
  {
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    attachment: {
      type: String, // store file URL or path
    },
    date: {
      type: Date,
      required: true,
      default: () => {
        const d = new Date();
        d.setHours(0, 0, 0, 0); // normalize date
        return d;
      },
    },
  },
  { _id: false },
);

const StudentLeaveSchema = new Schema<IStudentLeave>(
  {
    // batchId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Batches',
    //   required: true,
    //   index: true,
    // },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Students',
      required: true,
      index: true,
    },
    leaveHistory: {
      type: [LeaveHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

StudentLeaveSchema.index({ studentId: 1 }, { unique: true });

export const studentLeaveModel = mongoose.model<IStudentLeave>('StudentLeave', StudentLeaveSchema);
