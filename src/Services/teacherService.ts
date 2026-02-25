import { Types } from 'mongoose';

import { Request, Response } from 'express';
import { ITeacher, ITeacherBio } from '../Models/teacherModel';
import { teacherModel } from '../Models';
import { TeacherDTO, TeacherValidation } from '../dto/teacherDto';
import { serviceReturnType } from '../Constants/interfaces';
import { ITeacherService } from '../Interfaces/services/ITeacherService';
// import { TeacherResponseBody } from '../Utils/ResponseBody/teacher.responseBody';
// import { IGetAllTeachers } from '../Interfaces/Other/getAllTeachers';
import { ApiResponse } from '../Constants/apiResponse';
// import { TeacherType } from '../types/teacher.types';
import logger from '../Utils/logger';
import { injectable, inject } from 'tsyringe';
import { TeacherRepository } from '../Repository/teacherRepo';
import { TeacherMessage } from '../Constants/resposeMessages';

@injectable()
export class TeacherService implements ITeacherService {
  constructor(
    @inject(TeacherRepository)
    private teacherRepo: TeacherRepository,
  ) {}

  /* -------------CREATE TEACHER------------------- */

  public async createTeacherBio(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const data = TeacherDTO.createBio(req, res);

      if (data.email && data.phone) {
        const exists = await this.teacherRepo.findOne({
          email: data.email,
          phone: data.phone,
        });

        if (exists) {
          return ApiResponse.badRequest(TeacherMessage.TeacherExists);
        }
      }

      const created = await this.teacherRepo.create(data);

      if (!created) {
        return ApiResponse.failure(TeacherMessage.TeacherCreateFailed);
      }

      return ApiResponse.success(created, TeacherMessage.TeacherBioCreated);
    } catch (error) {
      logger.error('CreateTeacherBio failed', {
        layer: 'service',
        module: 'teacher',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  public async createTeacher(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      TeacherValidation.teacher(req, res);

      const data = await TeacherDTO.create(req, res);

      if (data.academicYearId && data.designation=='teacher') {
        const exists = await this.teacherRepo.findOneProfessional({
          academicYearId: data.academicYearId,
          employmentStatus: 'active',
        });

        if (exists) {
          this.teacherRepo.deleteTeacherBio(req.params.id!)
          return ApiResponse.badRequest(TeacherMessage.ClassTeacherAlreadyAssigned);
        }

        if (data.teacherId) {
          await this.teacherRepo.softDelete(data.teacherId.toString());
        }
      }

      const created = await this.teacherRepo.createProfessional(data);

      if (!created) {
        return ApiResponse.failure(TeacherMessage.TeacherCreateFailed);
      }

      return ApiResponse.success(created, TeacherMessage.TeacherCreated);
    } catch (error) {
      logger.error('CreateTeacher failed', {
        layer: 'service',
        module: 'teacher',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  public async getAllTeachers(): Promise<serviceReturnType> {
    try {
      const result = await this.teacherRepo.getAllTeachers();

      if (!result || !result.teacherBio || result.teacherBio.length === 0) {
        return ApiResponse.notFound(TeacherMessage.NoTeachersFound);
      }

      return ApiResponse.success(result, TeacherMessage.TeachersListed);
    } catch (error) {
      logger.error('GetAllTeachers failed', {
        layer: 'service',
        module: 'teacher',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* =================================================
      GET TEACHER BY ID
  ================================================= */
  public async getTeacherById(teacherId: string): Promise<serviceReturnType> {
    try {
      if (!Types.ObjectId.isValid(teacherId)) {
        return ApiResponse.badRequest(TeacherMessage.InvalidTeacherId);
      }

      const bio = await this.teacherRepo.findById(teacherId);

      const professional = await this.teacherRepo.findProfessionalById(teacherId);

      if (!bio || !professional) {
        return ApiResponse.notFound(TeacherMessage.TeacherNotFound);
      }

      return ApiResponse.success(
        { teacherBio: bio, teacher: professional },
        TeacherMessage.TeacherFetched,
      );
    } catch (error) {
      logger.error('GetTeacherById failed', {
        layer: 'service',
        module: 'teacher',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* =================================================
      UPDATE TEACHER BIO
  ================================================= */
  public async updateTeacherBio(teacherId: string, req: Request): Promise<serviceReturnType> {
    try {
      if (!Types.ObjectId.isValid(teacherId)) {
        return ApiResponse.badRequest(TeacherMessage.InvalidTeacherId);
      }

      const updatePayload = TeacherDTO.updateBio(req);

      const updated = await this.teacherRepo.updateBioById(teacherId, updatePayload);

      if (!updated) {
        return ApiResponse.notFound(TeacherMessage.TeacherNotFound);
      }

      return ApiResponse.success(updated, TeacherMessage.TeacherUpdated);
    } catch (error) {
      logger.error('UpdateTeacherBio failed', {
        layer: 'service',
        module: 'teacher',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* =================================================
      ASSIGN CLASS
  ================================================= */
  public async assignClassToTeacher(req: Request): Promise<serviceReturnType> {
    try {
      const dto = TeacherDTO.assignClass(req);

      const updated = await this.teacherRepo.assignClass(dto.teacherId, dto.batchId);

      if (!updated) {
        return ApiResponse.failure(TeacherMessage.TeacherUpdateFailed);
      }

      return ApiResponse.success(updated, TeacherMessage.ClassAssigned);
    } catch (error) {
      logger.error('AssignClass failed', {
        layer: 'service',
        module: 'teacher',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* ---------DELETE TEACHER (SOFT DELETE)---------- */
  public async deleteTeacher(teacherId: string): Promise<serviceReturnType> {
    try {
      const deleted = await this.teacherRepo.softDelete(teacherId);

      if (!deleted) {
        return ApiResponse.notFound(TeacherMessage.TeacherNotFound);
      }

      return ApiResponse.success(null, TeacherMessage.TeacherDeleted);
    } catch (error) {
      logger.error('DeleteTeacher failed', {
        layer: 'service',
        module: 'teacher',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* ----------------------------------------
        UPDATE TEACHER
  ---------------------------------------- */
  static async updateTeacher(teacherId: string, updateData: Partial<ITeacher>): Promise<ITeacher> {
    if (!Types.ObjectId.isValid(teacherId)) {
      throw new Error('Invalid teacher id');
    }

    // Prevent reassignment conflict
    if (updateData.academicYearId) {
      const exists = await teacherModel.findOne({
        _id: { $ne: teacherId },
        academicYearId: updateData.academicYearId,
        employmentStatus: 'active',
      });

      if (exists) {
        throw new Error('Another teacher is already class teacher for this batch');
      }
    }

    const updated = await teacherModel
      .findByIdAndUpdate(teacherId, { $set: updateData }, { new: true })
      .lean<ITeacher>();

    if (!updated) {
      throw new Error('Teacher not found');
    }

    return updated;
  }

  public async getUnassignedTeachers(): Promise<serviceReturnType> {
    const teachers = await this.teacherRepo.getUnassignedTeachers();

    if (!teachers.length) {
      return ApiResponse.notFound('No unassigned teachers found');
    }

    return ApiResponse.success(teachers, 'Unassigned teachers fetched successfully');
  }

  /* ----------------------------------------
        FETCH ALL TEACHERS
  ---------------------------------------- */
  static async fetchAllTeachers(
    tenantId: string,
    filters: {
      academicYearId?: string;
      centerId?: string;
      department?: string;
      employmentStatus?: string;
      batchId?: string;
    } = {},
  ): Promise<ITeacher[]> {
    const query: any = { tenantId };

    if (filters.academicYearId) query.academicYearId = filters.academicYearId;

    if (filters.centerId) query.centerId = filters.centerId;

    if (filters.department) query.department = filters.department;

    if (filters.employmentStatus) query.employmentStatus = filters.employmentStatus;

    if (filters.batchId) query.classTeacherOf = filters.batchId;

    return teacherModel
      .find(query)
      .populate('classTeacherOf')
      .populate('assignedSubjects')
      .populate('academicYearId')
      .populate('centerId')
      .lean<ITeacher[]>();
  }

  /* ----------------------------------------
        FETCH SINGLE TEACHER
  ---------------------------------------- */
  static async fetchTeacherById(teacherId: string): Promise<ITeacher> {
    if (!Types.ObjectId.isValid(teacherId)) {
      throw new Error('Invalid teacher id');
    }

    const teacher = await teacherModel
      .findById(teacherId)
      .populate('classTeacherOf')
      .populate('assignedSubjects')
      .populate('academicYearId')
      .populate('centerId')
      .lean<ITeacher>();

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    return teacher;
  }

  /* ----------------------------------------
        ASSIGN SUBJECTS TO TEACHER
  ---------------------------------------- */
  static async assignSubjects(teacherId: string, subjectIds: string[]): Promise<ITeacher> {
    const updated = await teacherModel
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

    if (!updated) {
      throw new Error('Teacher not found');
    }

    return updated;
  }

  /* ----------------------------------------
        REMOVE SUBJECT FROM TEACHER
  ---------------------------------------- */
  static async removeSubject(teacherId: string, subjectId: string): Promise<ITeacher> {
    const updated = await teacherModel
      .findByIdAndUpdate(
        teacherId,
        {
          $pull: {
            assignedSubjects: subjectId,
          },
        },
        { new: true },
      )
      .lean<ITeacher>();

    if (!updated) {
      throw new Error('Teacher not found');
    }

    return updated;
  }
}
