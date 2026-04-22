import { FilterQuery } from 'mongoose';
import { IPlan } from '@Models/subsciptionPlanModel';

export interface IPlanRepository {
  create(data: Partial<IPlan>): Promise<IPlan | null>;

  findByName(name: string): Promise<IPlan | null>;

  findAll(query?: FilterQuery<Partial<IPlan>>): Promise<IPlan[]>;

  findById(id: string): Promise<IPlan | null>;

  update(id: string, data: Partial<IPlan>): Promise<IPlan | null>;

  delete(id: string): Promise<IPlan | null>;
}
