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
import { SchoolDTO } from "../dto/schoolDTO";
import { AddressDTO } from "../dto/addressDTO";
import { IAddress } from "../Models/addressModel";





export class SchoolController {
    private schoolService: ISchoolService;

    constructor(schoolService: ISchoolService) {
        this.schoolService = schoolService;
    }

    //*create
    public async createSchool(req: Request, res: Response, next: NextFunction) {
        try {
            const schoolData:Partial<ISchool> = SchoolDTO.createSchool(req.body);
            
            const adminId:string|undefined = req.user?.userId;  //JWT middleware attaches 

            const createdSchool = 
            await this.schoolService.createSchool(adminId, schoolData);

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
            
            const extractedDtoAdd:Partial<IAddress>=AddressDTO.handleAddress(req);
            const dbStoredAdd=await this.schoolService.addAddress(extractedDtoAdd);

            const responseBody=handleSchoolRB(dbStoredAdd);
            
            res.status(StatusCodes.CREATED).json(responseBody)

        } catch(err:any){
            next(err);
        }
    } 

    public async updateAddress(req:Request,res:Response,next:NextFunction){
        try{
            const extractedDtoAdd:Partial<IAddress>=AddressDTO.handleAddress(req);
            const dbStoredAdd=await this.schoolService.addAddress(extractedDtoAdd);

            const responseBody=handleSchoolRB(dbStoredAdd);
            
            res.status(StatusCodes.CREATED).json(responseBody)

        } catch(err:any){
            next(err);
        }
    } 


    //*Read
    public async getSchool(req: Request, res: Response, next: NextFunction) {
        try {
            const query = SchoolDTO.getSchool(req);

            const isSchool = 
            await this.schoolService.getSchool(query);

            const responseBody: IResponse<string|null> =handleSchoolResBody(isSchool);
            
            const status=isSchool ? StatusCodes.OK :StatusCodes.NOT_FOUND
            res
                .status(status)
                .json(responseBody);

        } catch (err) {
            next(err);
        }
    }
}
