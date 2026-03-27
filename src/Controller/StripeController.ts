import { NextFunction, Request, Response } from "express";
import { stripe } from "Config/stripe.config";
import { env } from "Config";
import logger from "@Utils/logger";
import { StatusCodes } from "@Constants/statusCodes";
import { IStripeService } from "@Interfaces/services/IStripeService"; 
import { inject, injectable } from "tsyringe";
import { TYPES } from "@DI/types";
import { serviceReturnType } from "@Constants/interfaces";
import { ApiResponse } from "@Constants/apiResponse";
import { StudentMessage } from "@Constants/resposeMessages";


@injectable()
export class StripeController {

    constructor(
        @inject(TYPES.StripeService)
        private _service:IStripeService
    ){}

    async createPaymentIntent(req: Request, res: Response, next: NextFunction) {
        try {
        const { amount, studentFeeId,userId } = req.body;

        const clientSecret = await this._service.createPaymentIntent(
            amount,
            studentFeeId,
            userId
        );

        return res.json({ clientSecret });

        } catch (error) {
        next(error);
        }
    }

    async callWebHook(req: Request, res: Response) {
        const sig = req.headers["stripe-signature"] as string;

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err) {
            logger.error("Webhook signature failed:", err);
            return res.status(StatusCodes.BAD_REQUEST).send(`Webhook Error`);
        }

        try {
            await this._service.handleWebhook(event);

            return res
                .status(StatusCodes.OK)
                .json({ received: true });

        } catch (err) {
            logger.error("Webhook processing error:", err);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ received: false });
        }
    }

    async getStudentFeeDetails(req: Request, res: Response, next: NextFunction){
        try {
            const { studentId } = req.params;

            if(!studentId){
                const {status,resBody}=ApiResponse.badRequest(StudentMessage.StudentIdNotFound);
                return res.status(status).json(resBody);
            }
    
            const { status, resBody }: serviceReturnType = await this._service.getStudentFeeDetails(studentId!);
    
            res.status(status).json(resBody);
        } catch (err) {
            next(err);
        }
    }
}