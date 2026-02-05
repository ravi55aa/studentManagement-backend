import { Request,Response,NextFunction } from "express";
import { ICenterService } from "../Interfaces/services/ICenterService";
import { serviceReturnType } from "../Constants/interfaces";


export class CentersController{
    
    private centerService:ICenterService;


    constructor(cs:ICenterService){
        this.centerService=cs;
    }


    async addNewCenter(req:Request,res:Response,next:NextFunction){
        try{
            const {status,resBody}:serviceReturnType=await this.centerService.createCenter(req,res);
    
            res.status(status).json(resBody);
        } catch(err){
            next(err);
        }
    }

    async addNewCenterAddress(req:Request,res:Response,next:NextFunction){
        try{
            const {status,resBody}:serviceReturnType=await this.centerService.createCenterAddress(req,res);
    
            res.status(status).json(resBody);
        } catch(err){
            next(err);
        }
    }

    async getAllCenters(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody}=await this.centerService.getAllCenters(req,res)

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }

    async getASchoolCenter(req:Request,res:Response,next:NextFunction){
        try{
            const {status,resBody}=await this.centerService.getCenterById(req,res);

            res.status(status).json(resBody);
        }catch(err){
                next(err);
            }
        }

    async editASchoolCenter(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody}=await this.centerService.updateCenter(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }
    
    async deleteASchoolCenter(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody}=await this.centerService.deleteCenter(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }
}