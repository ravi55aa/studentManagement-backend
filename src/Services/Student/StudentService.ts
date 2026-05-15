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
import { StudentMessage, BatchMessage, CommonMessage } from '@Constants/resposeMessages';
import { generateAdmissionNo, generateRollNo } from '@Utils/student.utils';
import { FailureError, NotFoundError } from '@Middlewares/narrowDownErrors';

@injectable()
export class StudentService implements IStudentService {
  constructor(
    @inject(TYPES.StudentRepository)
    private _studentRepository: IStudentRepository,
  ) {}

  // Get Student by ID
  async getStudentById(id: string): Promise<serviceReturnType> {
    if (!id) {
      logger.warn('[StudentService:getStudentById] Student ID missing');

      throw new NotFoundError(StudentMessage.StudentIdNotFound);
    }

    const student: IStudent | null = await this._studentRepository.findById(id);

    if (!student) {
      logger.warn('[StudentService:getStudentById] Student not found', {
        studentId: id,
      });

      throw new NotFoundError(StudentMessage.StudentNotFound);
    }

    return ApiResponse.success(student, StudentMessage.StudentFetched);
  }

  // Get Students by Query
  async getStudentsByQuery(query: FilterQuery<Partial<IStudent>>): Promise<serviceReturnType> {
    const students = await this._studentRepository.findMany(query);

    if (!students || students.length === 0) {
      logger.warn('[StudentService:getStudentsByQuery] No students found', {
        query,
      });

      throw new NotFoundError(StudentMessage.StudentNotFound);
    }

    return ApiResponse.success(students, StudentMessage.StudentsListed);
  }

  // Get All Students
  async getAllStudents(query: FilterQuery<Partial<IStudent>>): Promise<serviceReturnType> {
    const students = await this._studentRepository.findMany(query);

    if (!students || students.length === 0) {
      logger.warn('[StudentService:getAllStudents] No students found', {
        query,
      });

      throw new NotFoundError(StudentMessage.StudentNotFound);
    }

    return ApiResponse.success(students, StudentMessage.StudentsListed);
  }

  // Create Student
  async createStudent(req: Request, res: Response): Promise<serviceReturnType> {
    handleValidationOF(createStudentSchema, req.body, res);

    const studentData = StudentDTO.createStudent(req);

    const { batchId } = req.params;

    if (!batchId) {
      logger.warn('[StudentService:createStudent] Batch ID missing');

      throw new NotFoundError(CommonMessage.IdNotFound);
    }

    const batch = await batchModel.findById(batchId);

    if (!batch) {
      logger.warn('[StudentService:createStudent] Batch not found', {
        batchId,
      });

      throw new NotFoundError(BatchMessage.BatchNotFound);
    }

    studentData.center = batch.center;
    studentData.tenantId = batch.tenantId!;
    studentData.batch = batch._id;

    studentData.password = await bcrypt.hash(studentData.password!, 10);

    studentData.admissionNumber = await generateAdmissionNo(batchId);

    studentData.rollNumber = await generateRollNo(batchId);

    const created = await this._studentRepository.create(studentData);

    if (!created) {
      logger.error('[StudentService:createStudent] Failed to create student', {
        batchId,
        studentEmail: studentData.email,
        studentName: studentData.name,
      });

      throw new FailureError(StudentMessage.StudentCreateFailed);
    }

    return ApiResponse.success(created, StudentMessage.StudentCreated);
  }

  // Update Student
  async updateStudent(req: Request): Promise<serviceReturnType> {
    const dto = StudentDTO.updateStudent(req);

    const { studentId } = req.params;

    if (!studentId) {
      logger.warn('[StudentService:updateStudent] Student ID missing');

      throw new NotFoundError(CommonMessage.IdNotFound);
    }

    const updated = await this._studentRepository.updateStudent(studentId, dto);

    if (!updated) {
      logger.warn('[StudentService:updateStudent] Failed to update student', {
        studentId,
        payload: dto,
      });

      throw new NotFoundError(StudentMessage.StudentNotUpdated);
    }

    return ApiResponse.success(updated, StudentMessage.StudentUpdated);
  }

  // Delete Student
  async deleteStudent(id: string): Promise<serviceReturnType> {
    if (!id) {
      logger.warn('[StudentService:deleteStudent] Student ID missing');

      throw new NotFoundError(StudentMessage.StudentIdNotFound);
    }

    const deleted = await this._studentRepository.updateStudent(id, { isDeleted: true });

    if (!deleted) {
      logger.warn('[StudentService:deleteStudent] Student not found during delete', {
        studentId: id,
      });

      throw new NotFoundError(StudentMessage.StudentNotFound);
    }

    return ApiResponse.success(null, StudentMessage.StudentDeleted);
  }
}
