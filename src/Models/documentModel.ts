import mongoose, { Document } from 'mongoose';

//*sub Schema

export interface IUploadedDoc {
  url: string;
  fileName: string;
}

const uploadedDocSchema = new mongoose.Schema<IUploadedDoc>(
  {
    url: { type: String, required: true },
    fileName: { type: String, required: true },
  },
  { _id: false },
);

export interface IDocument extends Document {
  tenantId?: mongoose.Types.ObjectId | string | undefined;
  userId?: mongoose.Types.ObjectId | string | undefined;
  role?: string | null;
  docs: IUploadedDoc[];
}

const documentSchema = new mongoose.Schema<IDocument>(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'role',
      required: true,
    },
    role: {
      type: String,
      enum: ['School', 'Teacher', 'Student', 'Admin'],
      required: true,
      trim: true,
    },
    docs: {
      type: [uploadedDocSchema],
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IDocument>('Documents', documentSchema);
