import { FilterQuery } 
    from "mongoose";

import { IAddressService } 
    from "../Interfaces/services/IAddressService";
import { IAddress } 
    from "../Models/addressModel";
import { serviceReturnType } from "../Constants/interfaces";
import { IResponse } from "../Interfaces/IResponse";
import { AddressDTO } from "../dto/addressDTO";
import {Request,Response} from "express";
import { AddressRepository } from "../Repository/addressRepository";
import { injectable,inject } from "tsyringe";



@injectable()
export class AddressService implements IAddressService{
    
    constructor(
    @inject(AddressRepository) 
    private addressRepository:AddressRepository)
    {}

    async getSchoolAddress(id:string)
    :Promise<IAddress|null>{
        return await this.addressRepository.findById(id);
    }

    getUserAddress(query:FilterQuery<Partial<IAddress>>):Promise<IAddress|[]>{
        return this.addressRepository.findMany(query);
    }
    
    async createAddress(address:Partial<IAddress>){
        return await this.addressRepository.create(address);
    }


    // user || teacher || center || school || admin
    public async updateAddress(req:Request,res:Response):Promise<serviceReturnType>{
        const dto=AddressDTO.updateAddress(req,res);
        
        const query={userId:dto.userId};

        const addressUpdated=await this.addressRepository.updateAddress(query,dto);

        //handleResBody
        const status=addressUpdated ? 200 : 500;
        const resBody:IResponse<Partial<IAddress|null>>={
            error:addressUpdated?null:"something went down",
            data:addressUpdated,
            success:addressUpdated!==null?true:false,
            message:addressUpdated?"Data fetched Successfully":"Something went down",
        }
        //const {status,resBody}=AcademicYearResponseBody.newAcademicYear(allData);
        
        return {status,resBody};
    }
}
