import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { serviceReturnType } from '@Constants/interfaces';
import { IHomeworkSubmission } from '@Models/Student/homeworkSubmitModel';

export interface IStudentHomeworkService {
  submitHomework(req: Request, res: Response): Promise<serviceReturnType>;

  updateSubmission(req: Request, res: Response): Promise<serviceReturnType>;

  deleteSubmission(req: Request): Promise<serviceReturnType>;

  getSubmission(id: string): Promise<serviceReturnType>;

  getallSubmission(query: FilterQuery<Partial<IHomeworkSubmission>>): Promise<serviceReturnType>;

  viewHomework(req: Request): Promise<serviceReturnType>;

  listStudentSubmissions(
    query: FilterQuery<Partial<IHomeworkSubmission>>,
  ): Promise<serviceReturnType>;
}
