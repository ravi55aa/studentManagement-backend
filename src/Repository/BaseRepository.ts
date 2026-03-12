import { Document, FilterQuery, Model, Types } from 'mongoose';

import logger from '../Utils/logger';
import { IBaseRepository } from '../Interfaces/repository/IBaseRepository';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  //* FIND ONE
  public async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        return null;
      }

      return await this.model.findOne(filter).select("+password").lean<T>();
    } catch (error) {
      logger.error('Error in findOne:', error);
      return null;
    }
  }

  //* FIND BY ID
  public async findById(id: string): Promise<T | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }

      return await this.model.findById(id).lean<T>();
    } catch (error) {
      logger.error('Error in findById:', error);
      return null;
    }
  }

  //* FIND MANY
  public async findMany(filter: FilterQuery<T>): Promise<T[] | []> {
    try {
      return await this.model.find(filter).lean<T[]>();
    } catch (error) {
      logger.error('Error in findMany:', error);
      return [];
    }
  }

  //* UPDATE BY ID
  public async updateById(id: string, updateData: Partial<T>): Promise<T | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }

      return await this.model
        .findByIdAndUpdate(
          id,
          { $set: updateData },
          {
            new: true,
            runValidators: true,
          },
        )
        .lean<T>();
    } catch (error) {
      logger.error('Error in updateById:', error);
      return null;
    }
  }

  //* CREATE
  public async create(data: Partial<T>): Promise<T | null> {
    try {
      return await this.model.create(data);
    } catch (error) {
      logger.error('Error in create:', error);
      return null;
    }
  }
}
