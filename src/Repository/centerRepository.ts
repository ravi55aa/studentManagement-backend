import { Types } from 'mongoose';
import { ICenterRepository } from '../Interfaces/repository/ICenterRepository';
import centerModel, { ICenter } from '../Models/centerModel';
import { BaseRepository } from './BaseRepository';
import { injectable } from 'tsyringe';
import logger from '../Utils/logger';

@injectable()
export class CenterRepository extends BaseRepository<ICenter> implements ICenterRepository {
  constructor() {
    super(centerModel);
  }

  async addCenter(centerData: Partial<ICenter>): Promise<ICenter | null> {
    try {
      return await this.create(centerData);
    } catch (error) {
      logger.error('Error while creating center:', error);
      return null;
    }
  }

  async findByName(name: string): Promise<ICenter | null> {
    try {
      return await this.findOne({ name });
    } catch (error) {
      logger.error('Error while finding center by name:', error);
      return null;
    }
  }

  async getAllCenters(): Promise<ICenter[]> {
    try {
      return await this.findMany({});
    } catch (error) {
      logger.error('Error while fetching centers:', error);
      return [];
    }
  }

  async updateCenter(id: string, updateData: Partial<ICenter>): Promise<ICenter | null> {
    try {
      return await this.updateById(id, updateData);
    } catch (error) {
      logger.error('Error while updating center:', error);
      return null;
    }
  }

  async deleteCenter(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return false;
      }

      const result = await this.model.deleteOne({ _id: id });

      return result.deletedCount === 1;
    } catch (error) {
      logger.error('Error while deleting center:', error);
      return false;
    }
  }
}
