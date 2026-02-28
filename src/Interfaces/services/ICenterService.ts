import { Request, Response } from 'express';

import { serviceReturnType } from '../../Constants/interfaces';

export interface ICenterService {
  createCenter(req: Request, res: Response): Promise<serviceReturnType>;

  createCenterAddress(req: Request, res: Response): Promise<serviceReturnType>;

  getCenterById(req: Request): Promise<serviceReturnType>;

  getAllCenters(): Promise<serviceReturnType>;

  updateCenter(req: Request, res: Response): Promise<serviceReturnType>;

  deleteCenter(req: Request): Promise<serviceReturnType>;

  //**📌 Relationship / Business Logic

  // assignAdminToCenter():any

  // removeAdminFromCenter():any

  // assignSchoolToCenter():any

  // removeSchoolFromCenter():any

  //** 📌 Status & Lifecycle

  // activateCenter():any

  // deactivateCenter():any
}
