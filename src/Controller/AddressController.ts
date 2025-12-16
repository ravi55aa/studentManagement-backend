import { Request,Response,NextFunction } 
    from "express";
import { IAddress } 
    from "../Models/addressModel";
import { handleSchoolRB } 
    from "../Utils/responseBody";
import { StatusCodes } 
    from "../Constants/statusCodes";
import { AddressDTO } 
    from "../dto/addressDTO";
import { AddressMessage } 
    from "../Constants/resposeMessages";

import { IAddressService } 
    from "../Interfaces/services/IAddressService";
import { handleAddressResponseBody } 
    from "../Utils/addressResponseBody";





export class AddressController{
    private addressService:IAddressService;

    constructor(addressService:IAddressService){
        this.addressService=addressService;
    }


    public async getSchoolAddress(req:Request,res:Response,next:NextFunction) : 
    Promise<void>{    
        try{
            const {id}=req.params;
            const address=this.addressService.getSchoolAddress(id);

            //pending responseBody
            const responseBody = 
            handleAddressResponseBody(AddressMessage.AddressListed,address);

            res
            .status(StatusCodes.OK)
            .json(responseBody);
            
        }catch(err){
            next(err);
        }
    }



    public async createAddress(req:Request,res:Response,next:NextFunction):Promise<void>{
        try{

            const extractedDtoAddr:Partial<IAddress> = 
            AddressDTO.handleAddress(req);
            
            const dbStoredAddr = await this.addressService.createAddress(extractedDtoAddr);

            const responseBody = 
            handleSchoolRB(dbStoredAddr);
            
            res.status(StatusCodes.CREATED).json(responseBody)

        } catch(err) {
            next(err);
        }
    }
}