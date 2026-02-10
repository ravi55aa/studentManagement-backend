import { Request,Response } from "express"

import { serviceReturnType } from "../Constants/interfaces";

import { IResponse } from "../Interfaces/IResponse";
import { StatusCodes } from "../Constants/statusCodes";

import {  batchModel, IBatches } from "../Models/batchModel";
import { BatchDto } from "../dto/batchDto";
import { BatchResponseBody } from "../Utils/ResponseBody/batch.response";
import { IBatchRepository } from "../Interfaces/repository/IBatchRepository";
import { IBatchService } from "../Interfaces/services/IBatchService";
import { idToObjectId } from "../Repository/forgotPassword.Repository";


export class BatchService implements IBatchService {

    private batchRepo:IBatchRepository;

    constructor(cr:IBatchRepository){
        this.batchRepo=cr
    }



    //!check batch already exist {prop:name};
    async createBatch(req:Request,res:Response):Promise<serviceReturnType> {

        const dto:Partial<IBatches> = BatchDto.handleNewBatchDto(req,res);

        const newBatchDoc:IBatches|null=await this.batchRepo.addBatch(dto);


        const {status,resBody} = BatchResponseBody.createBatch(newBatchDoc);

        return {status,resBody};
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



    //**📌 Relationship / Business Logic

    assignAdminToCenter(){}

    removeAdminFromCenter(){}

    assignSchoolToCenter(){}

    removeSchoolFromCenter(){}


    //** 📌 Status & Lifecycle

    activateCenter(){}

    deactivateCenter(){}

}