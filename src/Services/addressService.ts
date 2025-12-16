import { FilterQuery } 
    from "mongoose";
import { IAddressRepository } 
    from "../Interfaces/repository/IAddressRepository";
import { IAddressService } 
    from "../Interfaces/services/IAddressService";
import { IAddress } 
    from "../Models/addressModel";




export class AddressService implements IAddressService{

    private addressRepository:IAddressRepository;
    
    constructor(addressRepository:IAddressRepository){
        this.addressRepository=addressRepository;
    }

    getSchoolAddress(id:string)
    :Promise<IAddress|null>{
        return this.addressRepository.findById(id);
    }

    getUserAddress(query:FilterQuery<{}>):Promise<IAddress|{}>{
        return this.addressRepository.findMany(query);
    }
    
    createAddress(address:Partial<IAddress>){
        return this.addressRepository.create(address);
    }
}
// updateAddress(){}
// deleteAddress(){} 