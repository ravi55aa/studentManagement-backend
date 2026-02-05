import { Request,Response } from "express"
import { CenterDto } from "../dto/centersDto"
import centerModel, { ICenter } from "../Models/centerModel";
import { AddressDTO } from "../dto/addressDTO";
import { IAddress } from "../Models/addressModel";
import { serviceReturnType } from "../Constants/interfaces";
import { IAddressRepository } from "../Interfaces/repository/IAddressRepository";
import { IResponse } from "../Interfaces/IResponse";
import { StatusCodes } from "../Constants/statusCodes";
import { ICenterRepository } from "../Interfaces/repository/ICenterRepository";
import { CenterResponseBody } from "../Utils/ResponseBody/center.responsebody";
import { ICenterService } from "../Interfaces/services/ICenterService";
import { addressModel } from "../Models";


export class CentersService implements ICenterService{

    private addressRepo:IAddressRepository;
    private centerRepo:ICenterRepository;


    constructor(ar:IAddressRepository,cr:ICenterRepository){
        this.addressRepo=ar
        this.centerRepo=cr
    }

    //!center already exist {prop:name};
    async createCenter(req:Request,res:Response):Promise<serviceReturnType> {

        const dto:Partial<ICenter> = CenterDto.handleNewCenterDto(req,res);

        const newCenterDoc:Partial<ICenter|null> = await this.centerRepo.addCenter(dto);

        // const address:Partial<IAddress> = AddressDTO.handleAddress(req);
        
        // await this.addressRepo.create(address);


        const {status,resBody} = CenterResponseBody.createCenter(newCenterDoc);

        return {status,resBody};
    }


    async createCenterAddress(req:Request,res:Response):Promise<serviceReturnType> {
        const {id}=req.params;

        const dto:Partial<IAddress> = AddressDTO.handleAddress(req,res);
        dto.userId=id;
        dto.userType="Center";

        const doc:Partial<IAddress|null> = await addressModel.create(dto);


        const status=doc?200:404;
        const resBody:IResponse<Partial<IAddress|null>>={
            success:status==200?true:false,
            data:doc,
            error:status==200?null:"Something went error",
            message:status==200?"Fetched":"Not-fetched",
        }

        return {status,resBody};
    }


    async getCenterById(req:Request,res:Response):Promise<serviceReturnType>{
            const {id}=req.params;
            const doc:Partial<ICenter|null>=await this.centerRepo.findById(id!);
            
            //handleResBody
            const status=doc?200:404;
            const resBody:IResponse<Partial<ICenter|null>>={
                success:status==200?true:false,
                data:doc,
                error:status==200?null:"Something went error",
                message:status==200?"Fetched":"Not-fetched",
            }
    
            //const {status,resBody}=AcademicYearResponseBody.newAcademicYear(newAYearDoc);
            
            return {status,resBody};
        }



    async getAllCenters():Promise<serviceReturnType>{
        const arrayOfCentersDoc:ICenter[]=await this.centerRepo.getAllCenters();

        const status:number=StatusCodes.OK;

        //
        const responseBody:IResponse<ICenter[]>={
            data:arrayOfCentersDoc,
            error:null,
            message:"Centers Data fetched Successfully",
            success:true
        }

        return {status,resBody:responseBody};
    }



    async updateCenter(req:Request,res:Response):Promise<serviceReturnType> {

        const centerData:Partial<ICenter> = CenterDto.handleNewCenterDto(req,res);
        const {id}=req.params;


        // const updatedDoc:Partial<ICenter|null> = await this.centerRepo.updateCenter(centerData);

        const doc=await centerModel.findByIdAndUpdate(id,centerData,{new:true});

        // const address:Partial<IAddress> = AddressDTO.handleAddress(req);
        
        // await this.addressRepo.create(address);


        const {status,resBody} = CenterResponseBody.createCenter(doc);

        return {status,resBody};
    }



    async deleteCenter(req:Request,res:Response):Promise<serviceReturnType>{
        const {id} =  req.params
        
        const doc=await centerModel.deleteOne({_id:id});
        
        const status=doc?StatusCodes.OK:StatusCodes.CONFLICT;

        const resBody:IResponse<null>={
            success:status==200?true:false,
            data:null,
            error:status==200?null:"Something went error",
            message:status==200?"Deleted":"Not-deleted",
        }
        //const {status,resBody}=AcademicYearResponseBody.newAcademicYear(newAYearDoc);
        
        return {status,resBody};
    }



    //**📌 Relationship / Business Logic

    assignAdminToCenter(){}

    removeAdminFromCenter(){}

    assignSchoolToCenter(){}

    removeSchoolFromCenter(){}


    //** 📌 Status & Lifecycle

    activateCenter(){}

    deactivateCenter(){}

}