import { Request,Response,NextFunction } 
    from "express";
import { serviceReturnType } 
    from "../Constants/interfaces";
import { IBatchService } 
    from "../Interfaces/services/IBatchService";


export class BatchController{
    
    private centerService:IBatchService;


    constructor(cs:IBatchService){
        this.centerService=cs;
    }


    async addNewBatch(req:Request,res:Response,next:NextFunction){
        try{
            const {status,resBody}:serviceReturnType=await this.centerService.createBatch(req,res);
    
            res.status(status).json(resBody);
        } catch(err){
            next(err);
        }
    }

    async getAllBatches(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody}=await this.centerService.getAllBatches(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }
    async getASchoolBatch(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody}=await this.centerService.getBatchById(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }
    async editASchoolBatch(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody}=await this.centerService.updateABatch(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }

    async deleteASchoolBatch(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody}=await this.centerService.deleteBatch(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }
}