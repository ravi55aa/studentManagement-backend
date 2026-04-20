import { FilterQuery, Types } from 'mongoose';
import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';

import { TYPES } from '../DI/types';
import { ITeacher } from '../Models/teacherModel';
import { teacherModel } from '../Models';
import { TeacherDTO, TeacherValidation } from '../dto/teacherDto';
import { serviceReturnType } from '../Constants/interfaces';
import { ITeacherService } from '../Interfaces/services/ITeacherService';
import { ApiResponse } from '../Constants/apiResponse';
import logger from '../Utils/logger';
import { ServerMessage, TeacherMessage } from '../Constants/resposeMessages';
import { ITeacherRepo } from '../Interfaces/repository/ITeacherRepo';
import { TPaginationQuery } from '../types/pagination';
// import { getIO } from '../Config/socket.config';
// import { otp } from 'Utils/generateOtp';


@injectable()
export class TeacherService implements ITeacherService {
  constructor(
    @inject(TYPES.TeacherRepository)
    private _teacherRepo: ITeacherRepo,
  ) {}

  /* ------------CreateTeacher*/
  public async createTeacherBio(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const data = TeacherDTO.createBio(req, res);

      if (data.email && data.phone) {
        const exists = await this._teacherRepo.findOne({
          email: data.email,
          phone: data.phone,
        });

        if (exists) {
          return ApiResponse.badRequest(TeacherMessage.TeacherExists);
        }
      }

      const created = await this._teacherRepo.create(data);

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

      if (data.academicYearId && data.designation == 'teacher') {
        const exists = await this._teacherRepo.findOneProfessional({
          academicYearId: data.academicYearId,
          employmentStatus: 'active',
        });

        if (exists) {
          this._teacherRepo.deleteTeacherBio(req.params.id!);
          return ApiResponse.badRequest(TeacherMessage.ClassTeacherAlreadyAssigned);
        }

        if (data.teacherId) {
          await this._teacherRepo.softDelete(data.teacherId.toString());
        }
      }

      const created = await this._teacherRepo.createProfessional(data);

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

      return ApiResponse.failure(ServerMessage.ServerError);
    }
  }

  /* ===================GET/LIST All Teachers====================== */
  public async getAllTeachers(query:TPaginationQuery): Promise<serviceReturnType> {
    try {

      const result = await this._teacherRepo.getAllTeachers(query);

      if (!result) {
        return ApiResponse.notFound(TeacherMessage.NoTeachersFound);
      }

      return ApiResponse.success(result, TeacherMessage.TeachersListed);
    } catch (error) {
      logger.error(TeacherMessage.NoTeachersFound, {
        layer: 'service',
        module: 'teacher',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* ===========GET TEACHER BY ID=========== */
  public async getTeacherById(teacherId: string): Promise<serviceReturnType> {
    try {
      if (!Types.ObjectId.isValid(teacherId)) {
        return ApiResponse.badRequest(TeacherMessage.InvalidTeacherId);
      }

      const bio = await this._teacherRepo.findById(teacherId);

      const professional = await this._teacherRepo.findProfessionalById(teacherId);

      if (!bio || !professional) {
        logger.info('bio', bio, '\n professional', professional);

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

  /* ===================UPDATE TEACHER BIO====================== */
  public async updateTeacherBio(teacherId: string, req: Request): Promise<serviceReturnType> {
    try {
      if (!Types.ObjectId.isValid(teacherId)) {
        return ApiResponse.badRequest(TeacherMessage.InvalidTeacherId);
      }

      const updatePayload = TeacherDTO.updateBio(req);

      const updated = await this._teacherRepo.updateBioById(teacherId, updatePayload);

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

  async updateTeacher( req: Request,res:Response): Promise<serviceReturnType> {
      try {
      //TeacherValidation.teacher(req, res);

      const {teacherId}=req.params;

      const data=await TeacherDTO.update(req,res);

      if (data.academicYearId) {
      const exists = await this._teacherRepo.findOneProfessional({
        _id: { $ne: teacherId },
        academicYearId: data.academicYearId,
        employmentStatus: 'active',
        assignedSubjects:{$all:data.assignedSubjects}
      });

      if (exists) {
        return ApiResponse.failure(TeacherMessage.ClassTeacherAlreadyAssigned);
        //'Another teacher is already class teacher for this batch'
      }
      }

      const updated = await this._teacherRepo.updateProfessionalByTeacherId(teacherId!,data); 

      if (!updated) {
        return ApiResponse.notFound(TeacherMessage.TeacherUpdateFailed);
      }

      return ApiResponse.success(updated,TeacherMessage.TeacherUpdated);

    } catch (error) {
      logger.error(TeacherMessage.TeacherUpdateFailed, {
        layer: 'service',
        module: 'teacher',
        error,
      });

      return ApiResponse.failure(ServerMessage.ServerError);
    }
  }

  /* ===================ASSIGN CLASS====================== */
  public async assignClassToTeacher(req: Request): Promise<serviceReturnType> {
    try {
      const dto = TeacherDTO.assignClass(req);

      const updated = await this._teacherRepo.assignClass(dto.teacherId, dto.batchId);

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

  // public async deleteTeacher(teacherId: string): Promise<serviceReturnType> {tr
  //     const deleted = await this._teacherRepo.softDelete(teacherId);

  //     if (!deleted) {
  //       return ApiResponse.notFound(TeacherMessage.TeacherNotFound);
  //     }

  //     return ApiResponse.success(null, TeacherMessage.TeacherDeleted);
  //   } catch (error) {
  //     logger.error('DeleteTeacher failed', {
  //       layer: 'service',
  //       module: 'teacher',
  //       error,
  //     });

  //     return ApiResponse.failure('Internal server error');
  //   }
  // }


  public async getUnassignedTeachers(
    query: FilterQuery<Partial<ITeacher>>,paginationQuery:TPaginationQuery
  ): Promise<serviceReturnType> {
    
    if (query.center == 'School') {
      query.center = null;
    }

    const teachers
    = await this._teacherRepo.getUnassignedTeachers(query,paginationQuery);

    if (!teachers) {
      return ApiResponse.notFound(TeacherMessage.NoUnassignedTeachersFound);
    }

    return ApiResponse.success(teachers, TeacherMessage.UnassignedTeachersFetched);
  }

  /* ----------FETCH ALL TEACHERS------------- */
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

    const data = teacherModel
      .find(query)
      .populate('classTeacherOf')
      .populate('assignedSubjects')
      .populate('academicYearId')
      .populate('centerId')
      .lean<ITeacher[]>();

      return data;

  }

  /* ----------FETCH SINGLE TEACHER------------- */
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

  /* ----------ASSIGN SUBJECTS TO TEACHER------------- */
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

  /* ----------REMOVE SUBJECT FROM TEACHER------------- */
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

  public async verifyTeacherWithEmail(mail: string): Promise<serviceReturnType> {
    if (!mail || mail.length <= 0) {
      return ApiResponse.failure(TeacherMessage.InvalidTeacherEmail);
    }

    const query: FilterQuery<{ email: string }> = { email: mail };
    const teacher = await this._teacherRepo.findOne(query);

    if (!teacher) {
      return ApiResponse.notFound(TeacherMessage.TeacherNotFound);
    }

    return ApiResponse.success({ id: teacher._id }, TeacherMessage.TeacherVerify);
  }
}
