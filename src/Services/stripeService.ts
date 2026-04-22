import { inject, injectable } from 'tsyringe';
import { stripe } from 'Config/stripe.config';
import logger from '@Utils/logger';
import { IStudentFeeRepo } from '@Interfaces/repository/IStripeRepository';
import { IStripeService } from '@Interfaces/services/IStripeService';
import { TYPES } from '@DI/types';
import Stripe from 'stripe';
import {
  CommonMessage,
  ServerMessage,
  StripeMessage,
  StudentMessage,
} from '@Constants/resposeMessages';
import { serviceReturnType } from '@Constants/interfaces';
import { ApiResponse } from '@Constants/apiResponse';

@injectable()
export class StripeService implements IStripeService {
  constructor(
    @inject(TYPES.StripeRepository)
    private _repo: IStudentFeeRepo,
  ) {}

  async createPaymentIntent(
    amount: number,
    studentFeeId: string,
    studentId: string,
  ): Promise<string | null> {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
      metadata: { studentFeeId, studentId },
    });

    return paymentIntent.client_secret;
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        //  PAYMENT SUCCESS
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;

          const { studentFeeId, studentId } = paymentIntent.metadata;

          if (!studentFeeId || !studentId) {
            throw new Error(StripeMessage.MetadataMissing);
          }

          //  Prevent duplicate
          const existing = await this._repo.findByPaymentId(paymentIntent.id);

          if (existing) {
            logger.info('Already processed event');
            return;
          }

          await this._repo.markAsPaid({
            studentId: studentId,
            feeId: studentFeeId,
            paymentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
          });

          logger.info(StripeMessage.PaymentSuccess);
          break;
        }

        //  PAYMENT FAILED
        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;

          const studentFeeId = paymentIntent.metadata?.studentFeeId;

          if (!studentFeeId) {
            throw new Error(CommonMessage.IdNotFound);
          }

          await this._repo.markAsFailed(studentFeeId);

          logger.info(StripeMessage.PaymentFailed);
          break;
        }

        default:
          logger.info(`Unhandled event type: ${event.type}`);
      }
    } catch (error: unknown) {
      //  Proper error instance handling
      if (error instanceof Error) {
        logger.error(StripeMessage.WebhookProcessingFailed, error.message);
        throw error; // rethrow for controller
      }

      logger.error(StripeMessage.WebhookSignatureInvalid, error);
      throw new Error(StripeMessage.WebhookSignatureInvalid);
    }
  }

  async getStudentFeeDetails(studentId: string): Promise<serviceReturnType> {
    try {
      const result = await this._repo.getFeeDetails(studentId);

      if (!result) {
        return ApiResponse.notFound(StudentMessage.StudentFeeNotFound);
      }

      return ApiResponse.success(result, StudentMessage.StudentFeeFetched);
    } catch (error) {
      logger.error(StudentMessage.StudentNotFound, {
        layer: 'service',
        module: 'studentFee',
        error,
      });

      return ApiResponse.failure(ServerMessage.ServerError);
    }
  }
}
