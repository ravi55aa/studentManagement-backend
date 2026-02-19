import { Request,Response } from "express"

import { serviceReturnType } from "../Constants/interfaces";

import { IResponse } from "../Interfaces/IResponse";
import { StatusCodes } from "../Constants/statusCodes";

import {  batchModel, IBatches } from "../Models/batchModel";
import { BatchDto } from "../dto/batchDto";
import { BatchResponseBody } from "../Utils/ResponseBody/batch.response";

import { IBatchService } from "../Interfaces/services/IBatchService";
import { ApiResponse } from "../Constants/apiResponse";
import { injectable,inject } from "tsyringe";
import { BatchRepository } from "../Repository/batchRespository";



@injectable()
export class BatchService implements IBatchService {


    constructor(
        @inject(BatchRepository) 
        private batchRepo:BatchRepository
    ){
        
    }


    async createBatch( req: Request, res: Response)
    : Promise<serviceReturnType> {

        const dto: Partial<IBatches> =
            BatchDto.handleNewBatchDto(req, res);

        const existing =
            await this.batchRepo.findOne({
            tenantId: dto.tenantId,
            name: dto.name,
            code: dto.code,
            });

        if (existing) {
            return ApiResponse.badRequest(
            "Batch already exists with same name and code"
            );
        }

        const newBatchDoc: IBatches | null =
            await this.batchRepo.addBatch(dto);

        if (!newBatchDoc) {
            return ApiResponse.failure(
            "Failed to create batch"
            );
        }

        const { status, resBody } =
            BatchResponseBody.createBatch(newBatchDoc);

        return { status, resBody };
    }



    async getBatchById(req:Request,res:Response):Promise<serviceReturnType>{
        const {id}=req.params;
        const doc:Partial<IBatches|null>=await this.batchRepo.findById(id!);
        
        //handleResBody
        const status=doc?200:404;
        const resBody:IResponse<Partial<IBatches|null>>={
            success:status==200?true:false,
            data:doc,
            error:status==200?null:"Something went error",
            message:status==200?"Fetched":"Not-fetched",
        }

        //const {status,resBody}=AcademicYearResponseBody.newAcademicYear(newAYearDoc);
        
        return {status,resBody};
    }


    async getAllBatches(req:Request,res:Response):Promise<serviceReturnType>{
        const query= BatchDto.handleGetAllBatchesDto(req,res);

        const arrayOfCentersDoc:IBatches[]=await this.batchRepo.getAllBatches(query);

        const status:number=StatusCodes.OK;

        const responseBody:IResponse<IBatches[]>={
            data:arrayOfCentersDoc,
            error:null,
            message:"Centers Data fetched Successfully",
            success:true
        }

        return {status,resBody:responseBody};
    }


    async updateABatch(req:Request,res:Response):Promise<serviceReturnType>{

        const {id} =  req.params
        const dto = BatchDto.handleNewBatchDto(req,res);

        //repo call
        //const doc=await this.batchRepo.updateSubject({_id:id},dto);

        const doc:Partial<IBatches> = 
            await batchModel.updateOne({_id:id},dto).lean<IBatches>();

        const {status,resBody}=BatchResponseBody.createBatch(doc);
        
        return {status,resBody};
    }


    async deleteBatch(req:Request,res:Response):Promise<serviceReturnType>{
        const {id} =  req.params
        
        const doc=await batchModel.deleteOne({_id:id});
        
        const status=doc?StatusCodes.OK:StatusCodes.CONFLICT;

        const resBody:IResponse<null>={
            success:status==200?true:false,
            data:null,
            error:status==200?null:"Something went error",
            message:status==200?"Deleted":"Not-deleted",
        }
        //const {status,resBody}=AcademicYearResponseBody.newAcademicYear(newAYearDoc);
        
        return {status,resBody};
    }


    public async assignClassTeacher(
        batchId: string,
        teacherId: string
        ): Promise<serviceReturnType> {

        if (!batchId || !teacherId) {
            return ApiResponse.badRequest("Invalid ID");
        }

        // Check batch exists
        const batch =
            await this.batchRepo.findById(batchId);

        if (!batch) {
            return ApiResponse.notFound("Batch not found");
        }

        // Check batch already has teacher
        if (batch.batchCounselor) {
            return ApiResponse.badRequest(
            "Batch already has a class teacher"
            );
        }

        //  Check teacher already assigned somewhere
        const teacherAlreadyAssigned =
            await this.batchRepo.findByTeacherId(
            teacherId
            );

        if (teacherAlreadyAssigned) {
            return ApiResponse.badRequest(
            "Teacher is already assigned to another batch"
            );
        }

        //  Assign
        const updated =
            await this.batchRepo.assignTeacher(
            batchId,
            teacherId
            );

        if (!updated) {
            return ApiResponse.failure(
            "Failed to assign teacher"
            );
        }

        return ApiResponse.success(
            updated,
            "Teacher assigned successfully"
        );
    }


    //**📌 Relationship / Business Logic

    assignAdminToCenter(){}

    removeAdminFromCenter(){}

    assignSchoolToCenter(){}

    removeSchoolFromCenter(){}


    //** 📌 Status & Lifecycle

    activateCenter(){}

    deactivateCenter(){}

}