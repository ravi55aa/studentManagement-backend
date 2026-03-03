import { FilterQuery } from 'mongoose';

export interface IBaseRepository<T> {
  //* FIND ONE
  findOne(filter: FilterQuery<T>): Promise<T | null>;

  //* FIND BY ID
  findById(id: string): Promise<T | null>;

  //* FIND MANY
  findMany(filter: FilterQuery<T>): Promise<T[] | []>;

  //* UPDATE
  updateById(id: string, updateData: Partial<T>): Promise<T | null>;

  //* CREATE
  create(data: Partial<T>): Promise<T | null>;
}
