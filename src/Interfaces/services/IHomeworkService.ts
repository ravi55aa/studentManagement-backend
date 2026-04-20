import { Request, Response } from 'express';
import { serviceReturnType } from '@Constants/interfaces';
import { FilterQuery } from 'mongoose';
import { IHomework } from '@Interfaces/model/Teacher/IHomework';

import { TPaginationQuery } from '../../types/pagination';

export interface IHomeworkService {
  createHomework(req: Request, res: Response): Promise<serviceReturnType>;

  updateHomework(req: Request, res: Response): Promise<serviceReturnType>;

  deleteHomework(id: string): Promise<serviceReturnType>;

  getHomework(id: string): Promise<serviceReturnType>;

  viewHomework(req: Request): Promise<serviceReturnType>;

  listAllHomework(paginationQuery:TPaginationQuery,query: FilterQuery<Partial<IHomework>>): Promise<serviceReturnType>;
}
