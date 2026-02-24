import { FilterQuery, Types } from 'mongoose';
import { teacherModel } from '../Models';
import { ITeacher, ITeacherBio, teacherBioModel } from '../Models/teacherModel';
import { BaseRepository } from './BaseRepository';
import { ITeacherRepo } from '../Interfaces/repository/ITeacherRepo';
import logger from '../Utils/logger';
import { IGetAllTeachers } from '../Interfaces/Other/getAllTeachers';
import { batchModel } from '../Models/batchModel';
import { injectable } from 'tsyringe';

@injectable()
export class TeacherRepository extends BaseRepository<ITeacherBio> implements ITeacherRepo {
  constructor() {
    super(teacherBioModel);
  }

  /* ===============================
    CREATE PROFESSIONAL TEACHER
  ================================= */
  async createProfessional(data: Partial<ITeacher>): Promise<ITeacher | null> {
    try {
      const created = await teacherModel.create(data);
      return created.toObject();
    } catch (error) {
      logger.error('Error creating professional teacher:', error);
      return null;
    }
  }

  /* ===============================
     FIND PROFESSIONAL BY ID
  ================================= */
  async findProfessionalById(teacherId: string): Promise<ITeacher | null> {
    try {
      if (!Types.ObjectId.isValid(teacherId)) return null;

      return await teacherModel
        .findById(teacherId)
        .populate('classTeacherOf')
        .populate('assignedSubjects')
        .populate('academicYearId')
        .populate('centerId')
        .lean<ITeacher>();
    } catch (error) {
      logger.error('Error fetching teacher:', error);
      return null;
    }
  }

  /* ===============================
     GENERIC FIND ONE (PROFESSIONAL)
  ================================= */
  async findOneProfessional(query: FilterQuery<Partial<ITeacher>>): Promise<ITeacher | null> {
    try {
      return await teacherModel.findOne(query).lean<ITeacher>();
    } catch (error) {
      logger.error('Error finding teacher:', error);
      return null;
    }
  }

  /* ===============================
     UPDATE BIO
  ================================= */
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

  /* ===============================
     SOFT DELETE
  ================================= */
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

  /* ===============================
     ASSIGN SUBJECTS
  ================================= */
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

  /* ===============================
     REMOVE SUBJECT
  ================================= */
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

  /* ===============================
     ASSIGN CLASS
  ================================= */
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

  /* ===============================
     GET UNASSIGNED TEACHERS
  ================================= */
  async getUnassignedTeachers(): Promise<ITeacherBio[]> {
    try {
      const assignedIds = await batchModel
        .find({ batchCounselor: { $ne: null } })
        .distinct('batchCounselor');

      return await this.model.find({ _id: { $nin: assignedIds } }).lean<ITeacherBio[]>();
    } catch (error) {
      logger.error('Error fetching unassigned teachers:', error);
      return [];
    }
  }

  /* ===============================
     GET ALL TEACHERS (COMBINED)
  ================================= */
  async getAllTeachers(): Promise<IGetAllTeachers | null> {
    try {
      const bio = await this.model.find({}, { tenantId: 0 }).lean<ITeacherBio[]>();

      const professional = await teacherModel.find({}, { _id: 0 }).lean<ITeacher[]>();

      return {
        teacherBio: bio,
        teachersSchoolData: professional,
      };
    } catch (error) {
      logger.error('Error fetching teachers:', error);
      return null;
    }
  }
}
