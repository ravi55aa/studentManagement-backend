import { injectable } from 'tsyringe';

import { ISchoolRepository } from '../Interfaces/repository/ISchoolRepository';
import schoolModel, { ISchool } from '../Models/schoolModel';
import logger from '../Utils/logger';

import { BaseRepository } from './BaseRepository';

@injectable()
export class SchoolRepository extends BaseRepository<ISchool> implements ISchoolRepository {
  constructor() {
    super(schoolModel);
  }

  public async findByName(email: string): Promise<ISchool | null> {
    try {
      return await this.model.findOne({ email }).lean<ISchool>();
    } catch (error) {
      logger.error('Error finding school by email:', error);
      return null;
    }
  }

  public async findById(schoolId: string): Promise<ISchool | null> {
    try {
      if (!schoolId) return null;

      return await this.model.findById(schoolId).lean<ISchool>();
    } catch (error) {
      logger.error('Error finding school by ID:', error);
      return null;
    }
  }

  public async createSchool(schoolData: ISchool): Promise<ISchool | null> {
    try {
      return await this.model.create(schoolData);
    } catch (error) {
      logger.error('Error creating school:', error);
      return null;
    }
  }

  public async updateSchool(
    schoolId: string,
    updateData: Partial<ISchool>,
  ): Promise<ISchool | null> {
    try {
      if (!schoolId) return null;

      return await this.model
        .findByIdAndUpdate(
          schoolId,
          { $set: updateData },
          {
            new: true,
            runValidators: true,
          },
        )
        .lean<ISchool>();
    } catch (error) {
      logger.error('Error updating school:', error);
      return null;
    }
  }

  public async deleteSchool(schoolId: string): Promise<boolean> {
    try {

      const result = await this.model.findByIdAndUpdate(schoolId,
        {$set:{isDelete:true}},
        {new:true}
      );

      return !!result;
    } catch (error) {
      logger.error('Error deleting school:', error);
      return false;
    }
  }
}

/**
 * public async updateSchool(
        schoolId: string, 
        updateData: Partial<ISchool>
    ): Promise<ISchool | null> {
        return await schoolModel
            .findByIdAndUpdate(schoolId, updateData, { new: true })
            .exec();
    }

    public async deleteSchool(schoolId: string): Promise<boolean> {
        const result = await schoolModel.findByIdAndDelete(schoolId).exec();
        return result ? true : false;
    }

    public async getAllSchools(): Promise<ISchool[]> {
        return await schoolModel.find().exec();
    }
 */
