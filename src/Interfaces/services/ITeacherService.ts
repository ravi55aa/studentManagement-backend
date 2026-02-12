import { serviceReturnType } from "../../Constants/interfaces";
import { Request,Response } from "express";

export interface ITeacherService{
    
    createTeacher(req:Request,res:Response)
    : Promise<serviceReturnType>
    

    createTeacherBio(req:Request,res:Response)
    : Promise<serviceReturnType>
    

    getAllTeachers()
    : Promise<serviceReturnType> 


    assignClassToTeacher(req:Request)
    : Promise<serviceReturnType> 

}