import { BaseRepository } from '../../Repository/BaseRepository';
import { ICenter } from '../../Models/centerModel';

export interface ICenterRepository extends BaseRepository<ICenter> {
  addCenter(centerData: Partial<ICenter>): Promise<ICenter | null>;

  getAllCenters(): Promise<ICenter[]>;

  findByName(name: string): Promise<ICenter | null>;

  updateCenter(id: string, updateData: Partial<ICenter>): Promise<ICenter | null>;

  deleteCenter(id: string): Promise<boolean>;
}
