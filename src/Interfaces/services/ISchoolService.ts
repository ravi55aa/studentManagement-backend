import { Request, Response } from 'express';

import { IAddress } from '../../Models/addressModel';
import { serviceReturnType } from '../../Constants/interfaces';

export interface ISchoolService {
  createSchool(req: Request, res: Response): Promise<serviceReturnType>;

  addAddress(req: Request, res: Response): Promise<IAddress | null>;

  getSchool(req: Request, res: Response): Promise<serviceReturnType>;

  getallSchool(): Promise<serviceReturnType>;

  getSchoolAllData(req: Request, res: Response): Promise<serviceReturnType>;

  updateSchoolMeta(req: Request, res: Response): Promise<serviceReturnType>;

  deleteSchool(req: Request): Promise<serviceReturnType>;
}
