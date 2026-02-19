import { Request,Response,NextFunction } 
    from "express";
import { serviceReturnType } 
    from "../Constants/interfaces";

import { injectable,inject } from "tsyringe";
import { BatchService } from "../Services/batchService";



@injectable()
export class BatchController{


    constructor(
        @inject(BatchService) 
        private batchService:BatchService
    ){}


    async addNewBatch(req:Request,res:Response,next:NextFunction){
        try{
            const {status,resBody}:serviceReturnType=await this.batchService.createBatch(req,res);
    
            res.status(status).json(resBody);
        } catch(err){
            next(err);
        }
    }

    async getAllBatches(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody}=await this.batchService.getAllBatches(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }



    async getASchoolBatch(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody}=await this.batchService.getBatchById(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }


    async editASchoolBatch(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody}=await this.batchService.updateABatch(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }

    public async assignClassTeacher(
        req: Request,
        res: Response,
        next: NextFunction
        ): Promise<void> {
        try {
            const { id } = req.params; 
            const { teacherId } = req.body;

            const { status, resBody } =
            await this.batchService.assignClassTeacher(
                id!,
                teacherId
            );

            res.status(status).json(resBody);
        } catch (error) {
            next(error);
    }
    }



    async deleteASchoolBatch(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody}=await this.batchService.deleteBatch(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }
}