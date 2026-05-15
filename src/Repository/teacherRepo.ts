import { FilterQuery, Types } from 'mongoose';
import { injectable } from 'tsyringe';
import { teacherModel } from '@Models/index';
import { ITeacher, ITeacherBio, teacherBioModel } from '@Models/teacherModel';
import { ITeacherRepo } from '@Interfaces/repository/ITeacherRepo';
import logger from '@Utils/logger';
import { IGetAllTeachers } from '@Interfaces/Other/getAllTeachers';
import { batchModel } from '@Models/batchModel';

import { TPaginationQuery, TPaginationResult } from '../types/pagination';

import { BaseRepository } from './BaseRepository';

@injectable()
export class TeacherRepository extends BaseRepository<ITeacherBio> implements ITeacherRepo {
  constructor() {
    super(teacherBioModel);
  }

  /* ==============CREATE PROFESSIONAL TEACHER================= */
  async createProfessional(data: Partial<ITeacher>): Promise<ITeacher | null> {
    try {
      const created = await teacherModel.create(data);
      return created.toObject();
    } catch (error) {
      logger.error('Error creating professional teacher:', error);
      return null;
    }
  }

  /* ==============FIND PROFESSIONAL BY ID================= */
  async findProfessionalById(teacherId: string): Promise<ITeacher | null> {
    try {
      if (!Types.ObjectId.isValid(teacherId)) return null;

      return await teacherModel
        .findOne({ teacherId: teacherId })
        .populate('assignedSubjects')
        .lean<ITeacher>();
    } catch (error) {
      logger.error('Error fetching teacher:', error);
      return null;
    }
  }

  /* ==============GENERIC FIND ONE (PROFESSIONAL)================= */
  async findOneProfessional(query: FilterQuery<Partial<ITeacher>>): Promise<ITeacher | null> {
    try {
      return await teacherModel.findOne(query).lean<ITeacher>();
    } catch (error) {
      logger.error('Error finding teacher:', error);
      return null;
    }
  }

  /* ==============UPDATE BIO================= */
  async updateBioById(teacherId: string, data: Partial<ITeacherBio>): Promise<ITeacherBio | null> {
    try {
      if (!Types.ObjectId.isValid(teacherId)) return null;

      return await this.model
        .findByIdAndUpdate(teacherId, { $set: data }, { new: true })
        .lean<ITeacherBio>();
    } catch (error) {
      logger.error('Error updating teacher bio:', error);
      return null;
    }
  }

  public async updateProfessionalByTeacherId(
    teacherId: string,
    data: Partial<ITeacher>,
  ): Promise<ITeacher | null> {
    try {
      if (!Types.ObjectId.isValid(teacherId)) return null;

      return await teacherModel
        .findOneAndUpdate({ teacherId: teacherId }, { $set: data }, { new: true })
        .lean<ITeacher>();
    } catch (error) {
      logger.error('Error updating teacher bio:', error);
      return null;
    }
  }

  /* ==============SOFT DELETE================= */
  async softDelete(teacherId: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(teacherId)) return false;

      const result = await teacherModel.updateOne(
        { teacherId: teacherId },
        {
          $set: {
            employmentStatus: 'terminated',
            dateOfLeaving: new Date(),
          },
        },
      );

      return result.modifiedCount === 1;
    } catch (error) {
      logger.error('Error soft deleting teacher:', error);
      return false;
    }
  }

  async deleteTeacherBio(teacherId: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(teacherId)) return false;

      const result = await teacherBioModel.deleteOne({ _id: teacherId });

      if (result.deletedCount <= 0) {
        return false;
      }
      return true;
    } catch (error) {
      logger.error('Error soft deleting teacher:', error);
      return false;
    }
  }

  /* ==============ASSIGN SUBJECTS to teacher================= */
  async assignSubjects(teacherId: string, subjectIds: string[]): Promise<ITeacher | null> {
    try {
      return await teacherModel
        .findByIdAndUpdate(
          teacherId,
          {
            $addToSet: {
              assignedSubjects: { $each: subjectIds },
            },
          },
          { new: true },
        )
        .lean<ITeacher>();
    } catch (error) {
      logger.error('Error assigning subjects:', error);
      return null;
    }
  }

  /* ==============REMOVE SUBJECT from teachers================= */
  async removeSubject(teacherId: string, subjectId: string): Promise<ITeacher | null> {
    try {
      return await teacherModel
        .findByIdAndUpdate(
          teacherId,
          {
            $pull: { assignedSubjects: subjectId },
          },
          { new: true },
        )
        .lean<ITeacher>();
    } catch (error) {
      logger.error('Error removing subject:', error);
      return null;
    }
  }

  /* ==============ASSIGN CLASS to teacher================= */
  async assignClass(teacherId: string, batchId: string): Promise<ITeacher | null> {
    try {
      return await teacherModel
        .findByIdAndUpdate(teacherId, { $set: { classTeacherOf: batchId } }, { new: true })
        .lean<ITeacher>();
    } catch (error) {
      logger.error('Error assigning class:', error);
      return null;
    }
  }

  /* ==============GET UNASSIGNED TEACHERS================= */
  async getUnassignedTeachers(
    query: FilterQuery<Partial<ITeacher>>,
    paginationQuery: TPaginationQuery,
  ): Promise<TPaginationResult<ITeacherBio> | null> {
    const page = Number(paginationQuery.page) || 1;
    const limit = Number(paginationQuery.limit) || 10;

    const skip = (page - 1) * limit;

    try {
      let assignedIds = null;
      if (query) {
        assignedIds = await batchModel
          .find({ ...query, batchCounselor: { $ne: null } })
          .distinct('batchCounselor');
      }

      const [data, total] = await Promise.all([
        this.model
          .find({ _id: { $nin: assignedIds } })
          .skip(skip)
          .limit(limit)
          .lean<ITeacherBio[]>(),

        this.model.find({ _id: { $nin: assignedIds } }).countDocuments(),
      ]);

      return { data, total, page, totalPages: Math.ceil(total / limit) };
    } catch (error) {
      logger.error('Error fetching unassigned teachers:', error);
      return null;
    }
  }

  /* ==============GET ALL TEACHERS (COMBINED)================= */
  async getAllTeachers(
    paginationQuery: TPaginationQuery,
    filter: FilterQuery<Partial<ITeacherBio>> = {},
  ): Promise<TPaginationResult<IGetAllTeachers> | null> {
    const page = Number(paginationQuery.page) || 1;
    const limit = Number(paginationQuery.limit) || 10;

    const skip = (page - 1) * limit;

    try {
      const [bio, total] = await Promise.all([
        this.model.find(filter, { tenantId: 0 }).skip(skip).limit(limit).lean<ITeacherBio[]>(), //bio

        this.model.find(filter, { tenantId: 0 }).countDocuments(), //total
      ]);

      //can do $lookup with aggregation;

      const teacherIds = bio.map((teacher) => teacher._id);

      const professional = await teacherModel
        .find({ teacherId: { $in: teacherIds } }, { _id: 0 })
        .skip(skip)
        .limit(limit)
        .lean<ITeacher[]>(); //professional

      const data: IGetAllTeachers[] = [{ teacherBio: bio, teachersSchoolData: professional }];

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error('Error fetching teachers:', error);
      return null;
    }
  }
}
