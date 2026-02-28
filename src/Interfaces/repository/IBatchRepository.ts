import { FilterQuery } from 'mongoose';

import { BaseRepository } from '../../Repository/BaseRepository';
import { IBatches } from '../../Models/batchModel';

export interface IBatchRepository extends BaseRepository<IBatches> {
  addBatch(centerData: Partial<IBatches>): Promise<IBatches | null>;

  getAllBatches(query: FilterQuery<Partial<IBatches>>): Promise<IBatches[]>;

  findByTeacherId(teacherId: string): Promise<IBatches | null>;

  assignTeacher(batchId: string, teacherId: string): Promise<IBatches | null>;

  updateBatch(id: string, updateData: Partial<IBatches>): Promise<IBatches | null>;

  deleteBatch(id: string): Promise<boolean>;
}
