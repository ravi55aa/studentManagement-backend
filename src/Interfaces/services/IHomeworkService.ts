import { Request, Response } from 'express';
import { serviceReturnType } from '@Constants/interfaces';
import { FilterQuery } from 'mongoose';
import { IHomework } from '@Interfaces/model/Teacher/IHomework';

export interface IHomeworkService {
  createHomework(req: Request, res: Response): Promise<serviceReturnType>;

  updateHomework(req: Request, res: Response): Promise<serviceReturnType>;

  deleteHomework(req: Request): Promise<serviceReturnType>;

  getHomework(id: string): Promise<serviceReturnType>;

  viewHomework(req: Request): Promise<serviceReturnType>;

  listAllHomework(query: FilterQuery<Partial<IHomework>>): Promise<serviceReturnType>;
}
