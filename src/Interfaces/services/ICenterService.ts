import { serviceReturnType } from "../../Constants/interfaces"
import {Request,Response} from "express";




export interface ICenterService{


    createCenter(req:Request,res:Response):Promise<serviceReturnType>

    createCenterAddress(req:Request,res:Response):Promise<serviceReturnType>

    getCenterById(req:Request,res:Response):Promise<serviceReturnType>


    getAllCenters(req:Request,res:Response):Promise<serviceReturnType>

    updateCenter(req:Request,res:Response):Promise<serviceReturnType>
    
    deleteCenter(req:Request,res:Response):Promise<serviceReturnType>

    //**📌 Relationship / Business Logic

    assignAdminToCenter():any

    removeAdminFromCenter():any

    assignSchoolToCenter():any

    removeSchoolFromCenter():any


    //** 📌 Status & Lifecycle

    activateCenter():any

    deactivateCenter():any
}