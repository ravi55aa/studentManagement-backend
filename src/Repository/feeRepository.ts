import { FilterQuery, Types } from 'mongoose';
import { injectable } from 'tsyringe';

import feeModel, { IFee } from '../Models/feesModel';
import { IFeeRepository } from '../Interfaces/repository/IFessRepository';
import logger from '../Utils/logger';
import { TPaginationQuery, TPaginationResult } from '../types/pagination';

import { BaseRepository } from './BaseRepository';

@injectable()
export class FeeRepository extends BaseRepository<IFee> implements IFeeRepository {
  constructor() {
    super(feeModel);
  }

  public async create(data: Partial<IFee>): Promise<IFee> {
    try {
      const fee = await feeModel.create(data);

      return fee.toObject();
    } catch (error) {
      logger.error(error);
      throw new Error(`Cannot create Fee: ${error}`);
    }
  }

  public async getAllFee(paginationQuery:TPaginationQuery,query: FilterQuery<Partial<IFee>>): Promise<TPaginationResult<IFee>|null> {
    try{
        const page=Number(paginationQuery.page)||1;
        const limit=Number(paginationQuery.limit) || 10;
    
        const skip=(page - 1) * limit;
    
        const [data,total] = await Promise.all([
  
          feeModel
            .find({ ...query, isDeleted: false }).skip(skip).limit(limit)
            .sort({ createdAt: -1 })
            .lean<IFee[]>(),     
            
            this.model.find({ }).countDocuments()
        ]);
      
        return { data, total ,page,totalPages:Math.ceil(total/limit) };

      } catch (error) {
        logger.error('Error fetching batches:', error);
        return null;
      }
  }

  public async updateById(id: string, data: Partial<IFee>): Promise<IFee | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return await feeModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<IFee>();
  }

  public async deleteById(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await feeModel.findByIdAndUpdate(id, {
      $set: { status: 'INACTIVE', isDeleted: true },
    });

    return !!result;
  }
}
