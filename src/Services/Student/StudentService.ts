import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import bcrypt from 'bcrypt';
import { TYPES } from '@DI/types';
import { IStudent } from '@Models/Student/studentModel';
import { ApiResponse } from '@Constants/apiResponse';
import logger from '@Utils/logger';
import { serviceReturnType } from '@Constants/interfaces';
import { IStudentService } from '@Interfaces/services/IStudentService';
import { StudentDTO } from '@dto/studentDTO';
import { handleValidationOF } from '@Middlewares/validateUser.middleware';
import { createStudentSchema } from '@Validators/student.validation';
import { batchModel } from '@Models/batchModel';
import { IStudentRepository } from '@Interfaces/repository/IStudentRepository';
import {
  StudentMessage,
  ServerMessage,
  BatchMessage,
  CommonMessage,
} from '@Constants/resposeMessages';
import { generateAdmissionNo, generateRollNo } from '@Utils/student.utils';

@injectable()
export class StudentService implements IStudentService {
  constructor(
    @inject(TYPES.StudentRepository)
    private _studentRepository: IStudentRepository,
  ) {}

  // Get Student by ID
  async getStudentById(id: string): Promise<serviceReturnType> {
    try {
      if (!id) {
        return ApiResponse.notFound(StudentMessage.StudentIdNotFound);
      }

      const student = await this._studentRepository.findById(id);

      if (!student) {
        return ApiResponse.notFound(StudentMessage.StudentNotFound);
      }

      return ApiResponse.success(student, StudentMessage.StudentFetched);
    } catch (error) {
      logger.error(StudentMessage.StudentNotFound, error);
      return ApiResponse.internalServerError(ServerMessage.ServerError);
    }
  }

  // Get Students by Query
  async getStudentsByQuery(query: FilterQuery<Partial<IStudent>>): Promise<serviceReturnType> {
    try {
      const students = await this._studentRepository.findMany(query);

      return ApiResponse.success(students, StudentMessage.StudentsListed);
    } catch (error) {
      logger.error(StudentMessage.StudentNotFound, error);
      return ApiResponse.internalServerError(ServerMessage.ServerError);
    }
  }

  // Get All Students
  async getAllStudents(query: FilterQuery<Partial<IStudent>>): Promise<serviceReturnType> {
    try {
      const students = await this._studentRepository.findMany(query);

      return ApiResponse.success(students, StudentMessage.StudentsListed);
    } catch (error) {
      logger.error(StudentMessage.StudentNotFound, error);
      return ApiResponse.internalServerError(ServerMessage.ServerError);
    }
  }

  // Create Student
  async createStudent(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      handleValidationOF(createStudentSchema, req.body, res);

      const studentData = StudentDTO.createStudent(req);
      const { batchId } = req.params;
      if (!batchId) {
        return ApiResponse.badRequest(CommonMessage.IdNotFound);
      }

      const batch = await batchModel.findById(batchId);

      if (!batch) {
        return ApiResponse.notFound(BatchMessage.BatchNotFound);
      }

      studentData.center = batch?.center;
      studentData.tenantId = batch?.tenantId;
      studentData.batch = batch?._id;
      studentData.password = await bcrypt.hash(studentData.password!, 10);
      studentData.admissionNumber = await generateAdmissionNo(batchId);
      studentData.rollNumber = await generateRollNo(batchId);

      const created = await this._studentRepository.create(studentData);

      if (!created) {
        return ApiResponse.internalServerError(StudentMessage.StudentCreateFailed);
      }

      return ApiResponse.success(created, StudentMessage.StudentCreated);
    } catch (error) {
      logger.error(StudentMessage.StudentCreateFailed, error);
      return ApiResponse.internalServerError(ServerMessage.ServerError);
    }
  }

  // Update Student
  // async updateStudent(req: Request, res: Response): Promise<serviceReturnType> {
  //     try {

  //     const dto = StudentDTO.updateStudent(req, res);

  //     const query = { _id: dto.studentId };

  //     const updated = await this._studentRepository.updateStudent(query, dto);

  //     if (!updated) {
  //         return ApiResponse.notFound(StudentMessage.StudentNotFound);
  //     }

  //     return ApiResponse.success(updated, StudentMessage.StudentUpdated);

  //     } catch (error) {
  //     logger.error(StudentMessage.StudentUpdateFailed, error);
  //     return ApiResponse.internalServerError(ServerMessage.ServerError);
  //     }
  // }

  // Delete Student (Soft Delete)
  async deleteStudent(id: string): Promise<serviceReturnType> {
    try {
      if (!id) {
        return ApiResponse.notFound(StudentMessage.StudentIdNotFound);
      }

      const deleted = await this._studentRepository.updateStudent(id, { isDeleted: true });

      if (!deleted) {
        return ApiResponse.notFound(StudentMessage.StudentNotFound);
      }

      return ApiResponse.success(null, StudentMessage.StudentDeleted);
    } catch (error) {
      logger.error(StudentMessage.StudentDeleteFailed, error);
      return ApiResponse.internalServerError(ServerMessage.ServerError);
    }
  }
}
