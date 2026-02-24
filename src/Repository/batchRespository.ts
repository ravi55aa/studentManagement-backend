import { FilterQuery, Types } from 'mongoose';
import { IBatchRepository } from '../Interfaces/repository/IBatchRepository';

import { IBatches, batchModel } from '../Models/batchModel';
import { BaseRepository } from './BaseRepository';
import { injectable } from 'tsyringe';
import logger from '../Utils/logger';

@injectable()
export class BatchRepository extends BaseRepository<IBatches> implements IBatchRepository {
  constructor() {
    super(batchModel);
  }

  async addBatch(batchData: Partial<IBatches>): Promise<IBatches | null> {
    try {
      return await this.create(batchData);
    } catch (error) {
      logger.error('Error creating batch:', error);
      return null;
    }
  }

  async getAllBatches(query: FilterQuery<Partial<IBatches>>): Promise<IBatches[]> {
    try {
      return await this.model
        .find(query)
        .populate('batchCounselor', '_id firstName')
        .lean<IBatches[]>();
    } catch (error) {
      logger.error('Error fetching batches:', error);
      return [];
    }
  }

  async findByTeacherId(teacherId: string): Promise<IBatches | null> {
    try {
      if (!Types.ObjectId.isValid(teacherId)) {
        return null;
      }

      return await this.model.findOne({ batchCounselor: teacherId }).lean<IBatches>();
    } catch (error) {
      logger.error('Error finding batch by teacherId:', error);
      return null;
    }
  }

  async assignTeacher(batchId: string, teacherId: string): Promise<IBatches | null> {
    try {
      if (!Types.ObjectId.isValid(batchId) || !Types.ObjectId.isValid(teacherId)) {
        return null;
      }

      return await this.model
        .findByIdAndUpdate(batchId, { $set: { batchCounselor: teacherId } }, { new: true })
        .lean<IBatches>();
    } catch (error) {
      logger.error('Error assigning teacher:', error);
      return null;
    }
  }

  async updateBatch(id: string, updateData: Partial<IBatches>): Promise<IBatches | null> {
    try {
      return await this.updateById(id, updateData);
    } catch (error) {
      logger.error('Error updating batch:', error);
      return null;
    }
  }

  async deleteBatch(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return false;
      }

      const result = await this.model.deleteOne({ _id: id });

      return result.deletedCount === 1;
    } catch (error) {
      logger.error('Error deleting batch:', error);
      return false;
    }
  }
}
