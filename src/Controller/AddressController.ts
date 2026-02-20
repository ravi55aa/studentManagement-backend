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

import { handleAddressResponseBody } 
    from "../Utils/addressResponseBody";
import { addressModel } from "../Models";
import { injectable,inject } from "tsyringe";
import { AddressService } from "../Services/addressService";




@injectable()
export class AddressController{

    constructor(
        @inject(AddressService) 
        private addressService:AddressService)
    {}


    public async getSchoolAddress(req:Request,res:Response,next:NextFunction) : 
    Promise<void>{    
        try{
            const {id}=req.params;
            const address=await this.addressService.getSchoolAddress(id!);

            //pending responseBody
            const responseBody = 
            handleAddressResponseBody(AddressMessage.AddressListed,address);

            res
            .status(StatusCodes.OK)
            .json(responseBody);
            
        } catch (err){
            next(err);
        }
    }


    public async getAddressById(req:Request,res:Response,next:NextFunction) : 
    Promise<void>{    
        try{
            const {id}=req.params;

            //later replace partial by promise
            //when move code to service layer.
            
            const address:Partial<IAddress|null>=await addressModel.findOne({userId:id}).lean<Partial<IAddress>>();

            //pending responseBody
            const {status,resBody} = 
            handleAddressResponseBody(AddressMessage.AddressListed,address);

            res
            .status(status)
            .json(resBody);
            
        }catch(err){
            next(err);
        }
    }

    public async getAddressAllAddress(req:Request,res:Response,next:NextFunction) : 
    Promise<void>{    
        try{
            
            const addresses:Partial<IAddress[]|null>=await addressModel.find().lean<Partial<IAddress[]>>();

            //pending responseBody
            //const responseBody = handleAddressResponseBody(AddressMessage.AddressListed,addresses);

            res
            .status(StatusCodes.OK)
            .json({message:"fetched",success:true,data:addresses});
            
        }catch(err){
            next(err);
        }
    }


    public async createAddress(req:Request,res:Response,next:NextFunction):Promise<void>{
        try{

            const dto:Partial<IAddress> = 
            AddressDTO.handleAddress(req,res);
            
            const dbStoredAddr = await this.addressService.createAddress(dto);

            const responseBody = 
            handleSchoolRB(dbStoredAddr);
            
            res.status(StatusCodes.CREATED).json(responseBody)

        } catch(err) {
            next(err);
        }
    }


    public async updateAddress(req:Request,res:Response,next:NextFunction):Promise<void>{
        try{
            
            const {status,resBody} = await this.addressService.updateAddress(req,res);
            
            res.status(status).json(resBody);

        } catch(err) {
            next(err);
        }
    }

    // public async deleteAddress(req:Request,res:Response,next:NextFunction):Promise<void>{
    //     try{
            
    //         const {status,resBody} = await this.addressService.deleteAddress(req,res);
            
    //         res.status(status).json(resBody);

    //     } catch(err) {
    //         next(err);
    //     }
    // }

}