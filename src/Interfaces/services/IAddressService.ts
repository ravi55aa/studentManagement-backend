import { FilterQuery } from "mongoose"
import { IAddress } from "../../Models/addressModel"


export interface IAddressService{
    getSchoolAddress(id:string|undefined):Promise<IAddress|null>
    //tenantId:"schoolId"
    //role:"school"

    getUserAddress(query:FilterQuery<{}>):Promise<IAddress|{}>
    //userId=paramId
    //tenantId=schoolId

    createAddress(address:Partial<IAddress>):Promise<IAddress>
}


    // updateAddress(address:IAddress):Promise<IAddress>

    // deleteAddress(address:IAddress):Promise<IAddress>