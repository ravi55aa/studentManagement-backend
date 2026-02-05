import { ISchool } from "../../Models/schoolModel";
import { IAddress } from "../../Models/addressModel";
import { Request,Response } from "express";
import { serviceReturnType } from "../../Constants/interfaces";




export interface ISchoolService {

    createSchool(req:Request,res:Response
        ) : Promise<ISchool>;

    addAddress(req:Request,res:Response
        ): Promise<IAddress>;

    getSchool(req:Request,res:Response
        ): Promise<ISchool | null>;

    getSchoolAllData(req:Request,res:Response
        ):Promise<serviceReturnType>;
    
    updateSchoolMeta(req:Request,res:Response)
    :Promise<serviceReturnType>

    //  NEW: DELETE SCHOOL
    deleteSchool(schoolId: string
        ): Promise<{ message: string }>;
}

