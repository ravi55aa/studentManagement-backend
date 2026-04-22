import { serviceReturnType } from '@Constants/interfaces';

export interface IStripeService {
  createPaymentIntent(
    amount: number,
    studentFeeId: string,
    studentId: string,
  ): Promise<string | null>;
  handleWebhook(event: unknown): Promise<void>;
  getStudentFeeDetails(studentId: string): Promise<serviceReturnType>;
}
