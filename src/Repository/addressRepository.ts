import { IAddressRepository } 
    from "../Interfaces/repository/IAddressRepository";
import { addressModel } 
    from "../Models";
import { IAddress } 
    from "../Models/addressModel";
import { BaseRepository } 
    from "./BaseRepository";




export class AddressRepository 
extends BaseRepository<IAddress>
implements IAddressRepository {

    constructor(){
        super(addressModel);
    }

    
}