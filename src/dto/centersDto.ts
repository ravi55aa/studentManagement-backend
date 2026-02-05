import {Request,Response} from "express";
import { ICenter } from "../Models/centerModel";
import { handleTokenVerification, refreshAccessToken, verifyToken } from "../Utils/jwt";
import { env } from "../Config";


export class CenterDto{

    static handleNewCenterDto(req:Request,res:Response){
        
        const {name,code,email,phone,totalCapacity,isMain,isActive}=req.body;

        const decodedToken=handleTokenVerification(req,res);

        const newCenterDto:Partial<ICenter>={
            name,
            code,email,phone,
            totalCapacity,isMain,isActive,

            currentStrength:0,
            tenantId:decodedToken?.tenantId,
            adminId:decodedToken?.userId,
            headInCharge:decodedToken?.userId,
        }

        return newCenterDto;
    }
}