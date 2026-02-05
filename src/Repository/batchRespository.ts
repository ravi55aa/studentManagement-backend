import { FilterQuery } from "mongoose";
import { IBatchRepository } from "../Interfaces/repository/IBatchRepository";

import { IBatches,batchModel } from "../Models/batchModel";
import { BaseRepository } from "./BaseRepository";



export class BatchRepository 
extends BaseRepository<IBatches> 
implements IBatchRepository{

    constructor(){
        super(batchModel);
    }

    async addBatch(batchData:IBatches):Promise<IBatches|null> {
        return await batchModel.create(batchData);
    }

    async getAllBatches(query:FilterQuery<Partial<IBatches>>):Promise<IBatches[]>{
        return await batchModel.find({tenantId:query.tenantId}).lean<IBatches[]>();
    }
}