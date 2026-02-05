import { FilterQuery } from "mongoose";
import { IAddress } from "../../Models/addressModel";
import { BaseRepository } from "../../Repository/BaseRepository";

export interface IAddressRepository 
extends BaseRepository<IAddress>{

    updateAddress (query:FilterQuery<Partial<IAddress>>,data:Partial<IAddress>):Promise<IAddress|null>
}