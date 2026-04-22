import { FilterQuery } from 'mongoose';
import { IHomework } from '@Interfaces/model/Teacher/IHomework';

import { TPaginationQuery, TPaginationResult } from '../../types/pagination';

export interface IHomeworkRepository {
  createHomework(data: Partial<IHomework>): Promise<IHomework | null>;

  findById(id: string): Promise<IHomework | null>;

  getAllHomework(
    paginationQuery: TPaginationQuery,
    query: FilterQuery<Partial<IHomework>>,
  ): Promise<TPaginationResult<IHomework> | null>;

  updateHomework(id: string, data: Partial<IHomework>): Promise<IHomework | null>;

  deleteHomework(id: string): Promise<boolean>;
}
