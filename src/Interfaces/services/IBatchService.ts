import { Request, Response } from 'express';

import { serviceReturnType } from '../../Constants/interfaces';

export interface IBatchService {
  createBatch(req: Request, res: Response): Promise<serviceReturnType>;

  getBatchById(req: Request): Promise<serviceReturnType>;

  getAllBatches(req: Request, res: Response): Promise<serviceReturnType>;

  updateABatch(req: Request, res: Response): Promise<serviceReturnType>;

  deleteBatch(req: Request): Promise<serviceReturnType>;

  //**📌 Relationship / Business Logic

  assignClassTeacher(batchId: string, teacherId: string): Promise<serviceReturnType>;

  // assignAdminToCenter():any

  // removeAdminFromCenter():any

  // assignSchoolToCenter():any

  // removeSchoolFromCenter():any

  //** 📌 Status & Lifecycle

  // activateCenter():any

  // deactivateCenter():any
}
