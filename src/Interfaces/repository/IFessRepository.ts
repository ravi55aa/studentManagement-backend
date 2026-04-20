import { FilterQuery } from 'mongoose';

import { IFee } from '../../Models/feesModel';
import { BaseRepository } from '../../Repository/BaseRepository';
import { TPaginationQuery, TPaginationResult } from '../../types/pagination';

export interface IFeeRepository extends BaseRepository<IFee> {
  create(data: Partial<IFee>): Promise<IFee>;

  getAllFee(paginationQuery:TPaginationQuery,query: FilterQuery<Partial<IFee>>): Promise<TPaginationResult<IFee>|null>

  updateById(id: string, data: Partial<IFee>): Promise<IFee | null>;

  deleteById(id: string): Promise<boolean>;
}
