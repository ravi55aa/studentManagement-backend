import { FilterQuery } from 'mongoose';

import { BaseRepository } from '../../Repository/BaseRepository';
import { IBatches } from '../../Models/batchModel';
import { TPaginationQuery, TPaginationResult } from '../../types/pagination';

export interface IBatchRepository extends BaseRepository<IBatches> {
  addBatch(centerData: Partial<IBatches>): Promise<IBatches | null>;

  getAllBatches(paginationQuery: TPaginationQuery, query: FilterQuery<Partial<IBatches>>): Promise<TPaginationResult<IBatches>|null>;

  findByTeacherId(teacherId: string): Promise<IBatches | null>;

  assignTeacher(batchId: string, teacherId: string): Promise<IBatches | null>;

  updateBatch(id: string, updateData: Partial<IBatches>): Promise<IBatches | null>;

  deleteBatch(id: string): Promise<boolean>;
}
