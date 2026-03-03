import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';

import { TYPES } from '../DI/types';
import { serviceReturnType } from '../Constants/interfaces';
import { ICenterService } from '../Interfaces/services/ICenterService';

@injectable()
export class CentersController {
  constructor(
    @inject(TYPES.CenterService)
    private _centerService: ICenterService,
  ) {}

  async addNewCenter(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType = await this._centerService.createCenter(
        req,
        res,
      );

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async addNewCenterAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType = await this._centerService.createCenterAddress(
        req,
        res,
      );

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async getAllCenters(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._centerService.getAllCenters();

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async getASchoolCenter(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._centerService.getCenterById(req);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async editASchoolCenter(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._centerService.updateCenter(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async deleteASchoolCenter(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._centerService.deleteCenter(req);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }
}
