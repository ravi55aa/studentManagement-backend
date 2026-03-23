import { injectable } from 'tsyringe';
import { Types } from 'mongoose';
import { BaseRepository } from '@Repository/BaseRepository';
import studentModel, { IStudent } from '@Models/Student/studentModel';
import logger from '@Utils/logger';
import { IStudentRepository } from '@Interfaces/repository/IStudentRepository';

@injectable()
export class StudentRepository extends BaseRepository<IStudent> implements IStudentRepository {
  constructor() {
    super(studentModel);
  }

  async addStudent(studentData: Partial<IStudent>): Promise<IStudent | null> {
    try {
      return await this.create(studentData);
    } catch (error) {
      logger.error('Error while creating student:', error);
      return null;
    }
  }

  async findByAdmissionNumber(admissionNumber: string): Promise<IStudent | null> {
    try {
      return await this.findOne({ admissionNumber });
    } catch (error) {
      logger.error('Error while finding student by admission number:', error);
      return null;
    }
  }

  async findById(id: string): Promise<IStudent | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }

      return await this.findOne({ _id: id, isDeleted: false });
    } catch (error) {
      logger.error('Error while finding student by id:', error);
      return null;
    }
  }

  async getAllStudents(): Promise<IStudent[]> {
    try {
      return await this.findMany({ isDeleted: false });
    } catch (error) {
      logger.error('Error while fetching students:', error);
      return [];
    }
  }

  // async getStudentsByQuery(query: Partial<IStudent>): Promise<IStudent[]> {
  //     try {
  //     return await this.findMany({ ...query, isDeleted: false });
  //     } catch (error) {
  //     logger.error("Error while fetching students by query:", error);
  //     return [];
  //     }
  // }

  async updateStudent(id: string, updateData: Partial<IStudent>): Promise<IStudent | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }

      return await this.updateById(id, updateData);
    } catch (error) {
      logger.error('Error while updating student:', error);
      return null;
    }
  }

  async deleteStudent(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return false;
      }

      const result = await this.model.updateOne({ _id: id }, { isDeleted: true });

      return result.modifiedCount === 1;
    } catch (error) {
      logger.error('Error while deleting student:', error);
      return false;
    }
  }
}
