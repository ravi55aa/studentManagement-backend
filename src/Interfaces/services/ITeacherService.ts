import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { ITeacher } from 'Models/teacherModel';
import { serviceReturnType } from '@Constants/interfaces';

import { TPaginationQuery } from '../../types/pagination';

export interface ITeacherService {
  createTeacher(req: Request, res: Response): Promise<serviceReturnType>;

  createTeacherBio(req: Request, res: Response): Promise<serviceReturnType>;

  updateTeacherBio(teacherId: string, req: Request): Promise<serviceReturnType>;
  
  updateTeacher(req: Request, res: Response): Promise<serviceReturnType>;

  getAllTeachers(query:TPaginationQuery): Promise<serviceReturnType>;

  getTeacherById(teacherId: string): Promise<serviceReturnType>;

  getUnassignedTeachers(query: FilterQuery<Partial<ITeacher>>,
    paginationQuery:TPaginationQuery): Promise<serviceReturnType>;

  assignClassToTeacher(req: Request): Promise<serviceReturnType>;

  verifyTeacherWithEmail(teacherEmail: string): Promise<serviceReturnType>;
}
