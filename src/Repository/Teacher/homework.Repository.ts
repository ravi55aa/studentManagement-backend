import { injectable } from 'tsyringe';
import { FilterQuery, Types } from 'mongoose';
import { IHomework } from '@Interfaces/model/Teacher/IHomework';
import { IHomeworkRepository } from '@Interfaces/repository/IHomeworkRepository';
import { homeworkModel } from '@Models/Teacher/homework.model';
import { BaseRepository } from '@Repository/BaseRepository';
import logger from '@Utils/logger';

import { TPaginationQuery, TPaginationResult } from '../../types/pagination';

@injectable()
export class HomeworkRepository extends BaseRepository<IHomework> implements IHomeworkRepository {
  constructor() {
    super(homeworkModel);
  }

  async createHomework(homeworkData: Partial<IHomework>): Promise<IHomework | null> {
    try {
      return await this.create(homeworkData);
    } catch (error) {
      logger.error('Error while creating homework:', error);

      return null;
    }
  }

  async findById(id: string): Promise<IHomework | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      logger.error('Error while finding homework by id:', error);
      return null;
    }
  }

  async getAllHomework(
    paginationQuery: TPaginationQuery,
    query: FilterQuery<Partial<IHomework>>,
  ): Promise<TPaginationResult<IHomework> | null> {
    try {
      const page = Number(paginationQuery?.page) || 1;
      const limit = Number(paginationQuery.limit) || 10;

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.model
          .find({ ...query, isDelete: false })
          .skip(skip)
          .limit(limit)
          .populate('subjectId')
          .lean<IHomework[] | []>(),

        this.model.find({ ...query, isDelete: false }).countDocuments(),
      ]);

      return { data, total, page, totalPages: Math.ceil(total / limit) };
    } catch (error) {
      logger.error('Error while fetching homework list:', error);
      return null;
    }
  }

  async updateHomework(id: string, updateData: Partial<IHomework>): Promise<IHomework | null> {
    try {
      return await this.updateById(id, updateData);
    } catch (error) {
      logger.error('Error while updating homework:', error);
      return null;
    }
  }

  async deleteHomework(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return false;
      }

      const result = await this.model.updateOne({ _id: id }, { $set: { isDelete: true } });

      return result.modifiedCount === 1;
    } catch (error) {
      logger.error('Error while deleting homework:', error);
      return false;
    }
  }
}
