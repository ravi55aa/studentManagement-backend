import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from '../Constants/statusCodes';

import { IResponse } from '../Interfaces/IResponse';
import { ISchool } from '../Models/schoolModel';
import { handleSchoolRB, handleSchoolResBody, validateResponseBody } from '../Utils/responseBody';
import { injectable, inject } from 'tsyringe';
import { SchoolService } from '../Services/schoolService';

@injectable()
export class SchoolController {
  constructor(
    @inject(SchoolService)
    private schoolService: SchoolService,
  ) {}

  //*create
  public async createSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const createdSchool = await this.schoolService.createSchool(req, res);

      const responseBody: IResponse<string | null> = validateResponseBody(createdSchool.id);
      res.status(StatusCodes.CREATED).json(responseBody);
    } catch (err) {
      next(err);
    }
  }

  public async addAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const dbStoredAdd = await this.schoolService.addAddress(req, res);

      const responseBody = handleSchoolRB(dbStoredAdd);

      res.status(StatusCodes.CREATED).json(responseBody);
    } catch (err) {
      next(err);
    }
  }

  //*update
  public async updateSchoolMeta(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this.schoolService.updateSchoolMeta(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  //*Read
  public async getSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const isSchool: ISchool | null = await this.schoolService.getSchool(req, res);

      const responseBody: IResponse<ISchool | null> = handleSchoolResBody(isSchool);

      res.status(isSchool ? StatusCodes.OK : StatusCodes.NOT_FOUND).json(responseBody);
    } catch (err) {
      next(err);
    }
  }

  //META+DOCUMENTS+ADDRESS = MDA
  public async getSchoolData_MDA(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, resBody } = await this.schoolService.getSchoolAllData(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  // public async updateSchool(req:Request,res:Response):Promise<void>{}

  // public async deleteSchool(req:Request,res:Response):Promise<void>{}
}
