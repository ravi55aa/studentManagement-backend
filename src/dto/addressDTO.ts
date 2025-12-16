

import {Request} from "express";

import { IAddress } from "../Models/addressModel";


    export class AddressDTO{
        static handleAddress(req:Request):Partial<IAddress>{
            const{ 
                street,
                city,
                state,
                zip,
                country
            } = req.body;
            
            return {
                userId:req.user?.userId,
                tenantId:req.user?.tenantId,
                street,
                city,
                state,
                zip,
                country,
            };
        }
    }