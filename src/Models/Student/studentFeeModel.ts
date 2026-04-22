import { Schema, model, Types, Document } from 'mongoose';

export interface IStudentFee extends Document {
  studentId: Types.ObjectId;
  feeId: Types.ObjectId;
  status: 'paid' | 'pending';
  amountPaid?: number;
  paidAt?: Date;
}

const studentFeeSchema = new Schema<IStudentFee>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Students',
      required: true,
    },
    feeId: {
      type: Schema.Types.ObjectId,
      ref: 'Fees',
      required: true,
    },
    status: {
      type: String,
      enum: ['paid', 'pending'],
      default: 'pending',
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

studentFeeSchema.index({ studentId: 1, feeId: 1 }, { unique: true });

export const studentFeeModel = model<IStudentFee>('StudentFees', studentFeeSchema);
