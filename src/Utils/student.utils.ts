import studentModel from '@Models/Student/studentModel';
import { batchModel, IBatches } from '@Models/batchModel';

export const generateAdmissionNo = async (batchId: string): Promise<string | null> => {
  const now = new Date();

  const datePart =
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');

  const totalStudentsInBatch: number = await studentModel.find({ batch: batchId }).countDocuments();

  const sequence = String(totalStudentsInBatch + 1).padStart(3, '0');

  return `${datePart}-${sequence}`;
};

export const generateRollNo = async (batchId: string): Promise<string | null> => {
  const batch: IBatches | null = await batchModel.findById(batchId).lean<IBatches>();

  if (!batch) return null;

  const totalStudentsInBatch: number = await studentModel.find({ batch: batchId }).countDocuments();

  return batch.name! + (totalStudentsInBatch + 1);
};
