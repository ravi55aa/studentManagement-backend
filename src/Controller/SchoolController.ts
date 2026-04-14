import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';

import { StatusCodes } from '../Constants/statusCodes';
import { handleSchoolRB } from '../Utils/responseBody';
import { ISchoolService } from '../Interfaces/services/ISchoolService';
import { TYPES } from '../DI/types';

@injectable()
export default class SchoolController {
  constructor(
    @inject(TYPES.SchoolService)
    private _schoolService: ISchoolService,
  ) {}

  public async createSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._schoolService.createSchool(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  public async addAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const dbStoredAdd = await this._schoolService.addAddress(req, res);

      const responseBody = handleSchoolRB(dbStoredAdd);

      res.status(StatusCodes.CREATED).json(responseBody);
    } catch (err) {
      next(err);
    }
  }

  public async updateSchoolMeta(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._schoolService.updateSchoolMeta(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  public async getSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._schoolService.getSchool(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  //META+DOCUMENTS+ADDRESS = MDA
  public async getSchoolData_MDA(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, resBody } = await this._schoolService.getSchoolAllData(req, res);

      res.status(status).json(resBody);

    } catch (err) {
      
      next(err);
    }
  }


  public async getallSchool(req: Request, res: Response, next: NextFunction): Promise<void> {
    {
      try {
        const { status, resBody } = await this._schoolService.getallSchool();

        res.status(status).json(resBody);
      } catch (err) {
        next(err);
      }
    }
  }


  // public async updateSchool(req:Request,res:Response):Promise<void>{}

  public async deleteSchool(req: Request, res: Response, next: NextFunction): Promise<void> {
    {
      try {
        const { status, resBody } = await this._schoolService.deleteSchool(req);

        res.status(status).json(resBody);
      } catch (err) {
        next(err);
      }
    }
  }
}
