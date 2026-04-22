import { injectable } from 'tsyringe';
import { subscriptionModel } from '@Models/subscriptinModel';

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

  public async getAllSchool(): Promise<ISchool[] | null> {
    try {
      return await this.model.find({ isDelete: false }).lean<ISchool[]>();
    } catch (error) {
      logger.error('Error finding school by ID:', error);

      return null;
    }
  }

  public async createSchool(schoolData: ISchool): Promise<ISchool | null> {
    try {
      const school = await this.model.create(schoolData);

      //Later move the code into subscription layer
      if (school) {
        await subscriptionModel.create({
          schoolId: school._id,
          planId: '69d685b2d982514b7bae5f9d',
          amount: '0',
          discount: '0',
          discountAmount: '0',
          finalAmount: '0',
          startDate: new Date().toISOString(),
          endDate: '2027-04-08T17:13:26.465Z',
          status: 'active',
          paymentStatus: 'paid',
          transactionId: 'free',
          paymentMethod: 'free',
          autoRenew: true,
        });
      }

      return school;
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
      const result = await this.model.findByIdAndUpdate(
        schoolId,
        { $set: { isDelete: true } },
        { new: true },
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
