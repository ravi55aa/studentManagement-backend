import { serviceReturnType } from '../../Constants/interfaces';
import { Request, Response } from 'express';

export interface ITeacherService {
  createTeacher(req: Request, res: Response): Promise<serviceReturnType>;

  createTeacherBio(req: Request, res: Response): Promise<serviceReturnType>;

  updateTeacherBio(teacherId: string, req: Request): Promise<serviceReturnType>;

  getAllTeachers(): Promise<serviceReturnType>;

  getTeacherById(teacherId: string): Promise<serviceReturnType>;

  getUnassignedTeachers(): Promise<serviceReturnType>;

  assignClassToTeacher(req: Request): Promise<serviceReturnType>;
}
