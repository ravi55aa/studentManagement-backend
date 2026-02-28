import { Request, Response } from 'express';

import { ISchool } from '../../Models/schoolModel';
import { IAddress } from '../../Models/addressModel';
import { serviceReturnType } from '../../Constants/interfaces';

export interface ISchoolService {
  createSchool(req: Request, res: Response): Promise<serviceReturnType>;

  addAddress(req: Request, res: Response): Promise<IAddress|null>;

  getSchool(req: Request, res: Response):Promise<serviceReturnType>;

  getSchoolAllData(req: Request, res: Response): Promise<serviceReturnType>;

  updateSchoolMeta(req: Request, res: Response): Promise<serviceReturnType>;

  deleteSchool(schoolId: string): Promise<{ message: string }>;
}
