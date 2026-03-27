// studentFee.repository.ts

import { injectable } from "tsyringe";
import { studentFeeModel, IStudentFee } from "@Models/Student/studentFeeModel";
import logger from "@Utils/logger";
import { IStudentFeeRepo } from "@Interfaces/repository/IStripeRepository"; 

import { BaseRepository } from "./BaseRepository"; 

@injectable()
export class StudentFeeRepository extends BaseRepository<IStudentFee> implements IStudentFeeRepo
    {

    constructor() {
        super(studentFeeModel);
    }

    async findByPaymentId(paymentId: string): Promise<IStudentFee | null> {
        try {
        return await this.model.findOne({ paymentId }).lean<IStudentFee>();
        } catch (error) {
        logger.error("Error finding by paymentId:", error);
        return null;
        }
    }

    async markAsPaid(payload: {
        studentId: string;
        feeId: string;
        paymentId: string;
        amount: number;
    }): Promise<IStudentFee | null> {
        try {
        return await studentFeeModel
            .updateOne(
            {studentId:payload.studentId}, //  correct usage
            {
                status: "paid",
                studentId: payload.studentId,
                feeId: payload.feeId,
                paymentId: payload.paymentId,
                amountPaid: payload.amount/10,
                paidAt: new Date(),
            },
            { upsert:true }
            )
            .lean<IStudentFee>();
        } catch (error) {
        logger.error("Error marking as paid:", error);
        return null;
        }
    }

    async markAsFailed(studentFeeId: string): Promise<IStudentFee | null> {
        try {
        return await this.model
            .findByIdAndUpdate(
            studentFeeId,
            { status: "failed" },
            { new: true }
            )
            .lean<IStudentFee>();
        } catch (error) {
        logger.error("Error marking as failed:", error);
        return null;
        }
    }

    async getFeeDetails(studentId: string): Promise<IStudentFee[] | []> {
        try {
        return await this.model
            .find({studentId:studentId})
            .lean<IStudentFee[]>();
        } catch (error) {
            logger.error("Error Fetching Fee details:", error);
            return [];
        }
    }
}