import { Request,Response } from "express";
import { IBatches } from "../Models/batchModel";
import { handleTokenVerification, refreshAccessToken, verifyToken } from "../Utils/jwt";
import { env } from "../Config";
import { FilterQuery } from "mongoose";
import { idToObjectId } from "../Repository/forgotPassword.Repository";

export class BatchDto {

    static handleNewBatchDto(req: Request,res:Response): Partial<IBatches> {
        

    const {
        name,
        code,
        isActive,
        center,
        academicYear,
        startDate,
        endDate,
        counselor
    } = req.body;

    const decodedToken=handleTokenVerification(req,res);

    const newBatchDto: Partial<IBatches> = {
        name,
        code,
        center:center,
        status:isActive?"active":"inActive",
        schedule: {
            startTime:startDate,endTime:endDate
        },
        academicYear:decodedToken?.tenantId, 
        //later updated the one active year

        batchCounselor:counselor ?? null,
        adminId: decodedToken?.userId,

        tenantId: decodedToken?.tenantId,
    }; 
    

    return newBatchDto;
    }


    static handleGetAllBatchesDto(req:Request,res:Response)
    :FilterQuery<Partial<IBatches>>{

        const decodedToken=handleTokenVerification(req,res);

        return {
            tenantId:decodedToken?.tenantId,
            adminId:decodedToken?.userId
        }
    }
}
