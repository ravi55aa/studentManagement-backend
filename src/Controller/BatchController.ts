import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';

import { TYPES } from '../DI/types';
import { serviceReturnType } from '../Constants/interfaces';
import { IBatchService } from '../Interfaces/services/IBatchService';

@injectable()
export default class BatchController {
  constructor(
    @inject(TYPES.BatchService)
    private _batchService: IBatchService,
  ) {}

  async addNewBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType = await this._batchService.createBatch(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async getAllBatches(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._batchService.getAllBatches(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async getASchoolBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._batchService.getBatchById(req);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async editASchoolBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._batchService.updateABatch(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  public async assignClassTeacher(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params; //batchId
      const { teacherId } = req.body;

      const { status, resBody } = await this._batchService.assignClassTeacher(id!, teacherId);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  async deleteASchoolBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._batchService.deleteBatch(req);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }
}
