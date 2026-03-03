import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { ITeacher } from 'Models/teacherModel';

import { serviceReturnType } from '../../Constants/interfaces';

export interface ITeacherService {
  createTeacher(req: Request, res: Response): Promise<serviceReturnType>;

  createTeacherBio(req: Request, res: Response): Promise<serviceReturnType>;

  updateTeacherBio(teacherId: string, req: Request): Promise<serviceReturnType>;

  getAllTeachers(): Promise<serviceReturnType>;

  getTeacherById(teacherId: string): Promise<serviceReturnType>;

  getUnassignedTeachers(query: FilterQuery<Partial<ITeacher>>): Promise<serviceReturnType>;

  assignClassToTeacher(req: Request): Promise<serviceReturnType>;
}
