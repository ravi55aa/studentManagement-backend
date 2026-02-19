import { FilterQuery } from "mongoose";
import { ICenterRepository } 
    from "../Interfaces/repository/ICenterRepository";
import centerModel, { ICenter } 
    from "../Models/centerModel"
import { BaseRepository } from "./BaseRepository";
import { injectable } from "tsyringe";



@injectable()
export class CenterRepository extends BaseRepository<ICenter> implements ICenterRepository{

    constructor(){
        super(centerModel);
    }
    
    async addCenter(centerData:ICenter):Promise<ICenter|null> {
        return await centerModel.create(centerData);
    }

    async getAllCenters():Promise<ICenter[]>{ //pass the Filter-query based on the tenantId+adminId; 
        return await centerModel.find().lean<ICenter[]>();
    }
}