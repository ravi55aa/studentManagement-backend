import { Request, Response, NextFunction } 
    from "express";
import { StatusCodes } 
    from "../Constants/statusCodes";

import { ISchoolService } 
    from "../Interfaces/services/ISchoolService";
import { IResponse } 
    from "../Interfaces/IResponse";
import { ISchool } 
    from "../Models/schoolModel";
import {  handleSchoolRB, handleSchoolResBody, validateResponseBody } 
    from "../Utils/responseBody";




export class SchoolController {
    private schoolService: ISchoolService;

    constructor(schoolService: ISchoolService) {
        this.schoolService = schoolService;
    }

    //*create
    public async createSchool(req: Request, res: Response, next: NextFunction) {
        try {

            const createdSchool = 
            await this.schoolService.createSchool(req,res);

            const responseBody: IResponse<string|null> = validateResponseBody(createdSchool.id);
            res
                .status(StatusCodes.CREATED)
                .json(responseBody);

        } catch (err) {
            next(err);
        }
    }

    public async addAddress(req:Request,res:Response,next:NextFunction){
        try{
        
            const dbStoredAdd=await this.schoolService.addAddress(req,res);

            const responseBody=handleSchoolRB(dbStoredAdd);
            
            res.status(StatusCodes.CREATED).json(responseBody)

        } catch(err:any){
            next(err);
        }
    }

    //*update
    public async updateSchoolMeta(req: Request, res: Response, next: NextFunction) {
        try {

            console.log("req.body",req.body,"\nreq.file",req.file,"\n req.files",req.files)

            const {status,resBody} = 
                await this.schoolService.updateSchoolMeta(req,res);
            
            res
                .status(status)
                .json(resBody);

        } catch (err) {
            next(err);
        }
    }


    //*Read 
    public async getSchool(req: Request, res: Response, next: NextFunction) {
        try {

            const isSchool:ISchool|null 
                = await this.schoolService.getSchool(req,res);

            const responseBody: IResponse<ISchool|null> = handleSchoolResBody(isSchool);
            
            res
                .status(isSchool ? StatusCodes.OK :StatusCodes.NOT_FOUND)
                .json(responseBody);

        } catch (err) {
            next(err);
        }
    }

    //META+DOCUMENTS+ADDRESS = MDA
    public async getSchoolData_MDA(req: Request, res: Response, next: NextFunction)
        :Promise<void>{
        try {
            const {status,resBody} = 
            await this.schoolService.getSchoolAllData(req,res);
            
            res
                .status(status)
                .json(resBody);

        } catch (err) {
            next(err);
        }
    }


    public async updateSchool(req:Request,res:Response):Promise<void>{}

    public async deleteSchool(req:Request,res:Response):Promise<void>{}

}
