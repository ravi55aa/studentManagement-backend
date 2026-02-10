

import {Request,Response} from "express";

import { IAddress } from "../Models/addressModel";
import { handleTokenVerification } from "../Utils/jwt";

import { SchoolAcademicYearDto } from "./schoolDTO";
import { idToObjectId } from "../Repository/forgotPassword.Repository";


    export class AddressDTO{
        static handleAddress(req:Request,res:Response):Partial<IAddress>{
            const{ 
                street,
                city,
                state,
                zip,
                country
            } = req.body;
            
            const {tenantId}= SchoolAcademicYearDto.getTenantId(req,res);
            

            return {
                city,
                street,
                state,
                country,
                zip,
                tenantId:tenantId,
                userId:tenantId,
                userType:"School"
            };
        }

        static updateAddress(req:Request,res:Response)
            :Partial<IAddress>{
                const {
                    street,
                    city,
                    state,
                    zip,
                    country
                } = req.body;

                const decoded = handleTokenVerification(req, res);
                
                const {id}=req.params;

                const updateYearDto:Partial<IAddress> = {
                    ...(street !== undefined && { street }),
                    ...(city !== undefined && { city }),
                    ...(state !== undefined && { state }),
                    ...(zip !== undefined && { zip }),
                    ...(country !== undefined && { country }),

                    userId: id,
                    tenantId: decoded.tenantId,
                };

                return updateYearDto;
        }
    }