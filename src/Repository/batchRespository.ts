import { FilterQuery } from 'mongoose';
import { IBatchRepository } from '../Interfaces/repository/IBatchRepository';

import { IBatches, batchModel } from '../Models/batchModel';
import { BaseRepository } from './BaseRepository';
import { injectable } from 'tsyringe';

@injectable()
export class BatchRepository extends BaseRepository<IBatches> implements IBatchRepository {
  constructor() {
    super(batchModel);
  }

  async addBatch(batchData: Partial<IBatches>): Promise<IBatches | null> {
    return await batchModel.create(batchData);
  }

  async getAllBatches(query: FilterQuery<Partial<IBatches>>): Promise<IBatches[]> {
    return await batchModel
      .find({ tenantId: query.tenantId })
      .populate('batchCounselor', '_id firstName')
      .lean<IBatches[]>();
  }

  public async findByTeacherId(teacherId: string): Promise<IBatches | null> {
    return batchModel.findOne({ batchCounselor: teacherId }).lean<IBatches>();
  }

  public async assignTeacher(batchId: string, teacherId: string): Promise<IBatches | null> {
    return batchModel
      .findByIdAndUpdate(batchId, { $set: { batchCounselor: teacherId } }, { new: true })
      .lean<IBatches>();
  }
}
