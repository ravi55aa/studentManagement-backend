import { FilterQuery } from "mongoose";
import { IFee } from "../../Models/feesModel";
import { BaseRepository } from "../../Repository/BaseRepository";

export interface IFeeRepository extends BaseRepository<IFee>{

    create(data: Partial<IFee>): Promise<IFee>;

    findMany(query: FilterQuery<Partial<IFee>>): Promise<IFee[]>;

    updateById(id: string, data: Partial<IFee>): Promise<IFee | null>;

    deleteById(id: string): Promise<boolean>;
}
