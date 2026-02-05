import { FilterQuery } 
    from "mongoose";
import { IAddressRepository } 
    from "../Interfaces/repository/IAddressRepository";
import { IAddressService } 
    from "../Interfaces/services/IAddressService";
import { IAddress } 
    from "../Models/addressModel";
import { serviceReturnType } from "../Constants/interfaces";
import { IResponse } from "../Interfaces/IResponse";
import { AddressDTO } from "../dto/addressDTO";
import {Request,Response} from "express";
import { addressModel } from "../Models";



export class AddressService implements IAddressService{

    private addressRepository:IAddressRepository;
    
    constructor(addressRepository:IAddressRepository){
        this.addressRepository=addressRepository;
    }

    async getSchoolAddress(id:string)
    :Promise<IAddress|null>{
        return await this.addressRepository.findById(id);
    }

    getUserAddress(query:FilterQuery<{}>):Promise<IAddress|{}>{
        return this.addressRepository.findMany(query);
    }
    
    async createAddress(address:Partial<IAddress>){
        //dto + validation
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

    // public async deleteAddress(req: Request, res: Response): Promise<serviceReturnType> {
    //     const query=AddressDTO.updateAddress(req,res);
    //     const data=await this.addressRepository.deleteOne(query);
        
    //     //TODO:- update to ResponseBody();
    //     const status=data?200:409;
    //     const resBody={
    //         success:data?true:false,
    //         error:data?null:"Something is error",
    //         message:data?"Deleted successfully":"Cant delete",
    //         data:data?data:null
    //     }

    //     return {status,resBody}
    // }
}
