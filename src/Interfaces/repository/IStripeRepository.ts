// studentFee.repo.interface.ts

import { IStudentFee } from '@Models/Student/studentFeeModel';
import { BaseRepository } from '@Repository/BaseRepository';

export interface IStudentFeeRepo extends BaseRepository<IStudentFee> {
  findByPaymentId(paymentId: string): Promise<IStudentFee | null>;

  markAsPaid(payload: {
    studentId: string;
    feeId: string;
    paymentId: string;
    amount: number;
  }): Promise<IStudentFee | null>;

  markAsFailed(studentFeeId: string): Promise<IStudentFee | null>;

  getFeeDetails(studentId: string): Promise<IStudentFee[] | []>;
}
