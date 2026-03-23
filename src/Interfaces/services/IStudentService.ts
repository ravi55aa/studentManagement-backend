import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { IStudent } from '@Models/Student/studentModel';
import { serviceReturnType } from '@Constants/interfaces';

export interface IStudentService {
  getStudentById(id: string): Promise<serviceReturnType>;

  getStudentsByQuery(query: FilterQuery<Partial<IStudent>>): Promise<serviceReturnType>;

  getAllStudents(query: FilterQuery<Partial<IStudent>>): Promise<serviceReturnType>;

  createStudent(req: Request, res: Response): Promise<serviceReturnType>;

  // updateStudent(
  //     req: Request,
  //     res: Response
  // ): Promise<serviceReturnType>;

  deleteStudent(id: string): Promise<serviceReturnType>;
}
