import { FilterQuery, Types } from "mongoose";
import feeModel,{IFee} from "../Models/feesModel";

import { IFeeRepository } from "../Interfaces/repository/IFessRepository"; 
import logger from "../Utils/logger";
import { BaseRepository } from "./BaseRepository";

export class FeeRepository extends BaseRepository<IFee> implements IFeeRepository {

    constructor(){
        super(feeModel);
    }

    public async create(
        data: Partial<IFee>
    ): Promise<IFee> {

        try {

            const fee = await feeModel.create(data);

            return fee.toObject();

        } catch (error) {
            logger.error(error);
            throw new Error(
                `Cannot create Fee: ${error}`
            );
        }
    }


    public async findMany(
        query: FilterQuery<Partial<IFee>>
    ): Promise<IFee[]> {

        return await feeModel
            .find({ ...query, isDeleted: false })
            .sort({ createdAt: -1 })
            .lean<IFee[]>();
    }


    public async updateById(
        id: string,
        data: Partial<IFee>
    ): Promise<IFee | null> {

        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return await feeModel
            .findByIdAndUpdate(
                id,
                { $set: data },
                { new: true }
            )
            .lean<IFee>();
    }


    public async deleteById(
        id: string
    ): Promise<boolean> {

        if (!Types.ObjectId.isValid(id)) {
            return false;
        }

        const result =
            await feeModel.findByIdAndUpdate(
                id,
                { $set: { status: "INACTIVE",isDeleted:true } }
            );

        return !!result;
    }
}
