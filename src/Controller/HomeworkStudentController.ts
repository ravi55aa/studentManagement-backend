import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IStudentHomeworkService } from '@Interfaces/services/IHomeworkStudentService';

import { TYPES } from '../DI/types';
import { serviceReturnType } from '../Constants/interfaces';

@injectable()
export class StudentHomeworkController {
  constructor(
    @inject(TYPES.StudentHomeworkService)
    private _homeworkService: IStudentHomeworkService,
  ) {}

  async submitHomework(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType = await this._homeworkService.submitHomework(
        req,
        res,
      );

      res.status(status).json(resBody);
    } catch (err: unknown) {
      next(err);
    }
  }

  async listStudentSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;

      const { status, resBody }: serviceReturnType =
        await this._homeworkService.listStudentSubmissions(query);

      res.status(status).json(resBody);
    } catch (err: unknown) {
      next(err);
    }
  }

  async getSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const { homeworkId } = req.params;

      const { status, resBody }: serviceReturnType = await this._homeworkService.getSubmission(homeworkId!);

      res.status(status).json(resBody);
    } catch (err: unknown) {
      next(err);
    }
  }

  async viewHomework(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType = await this._homeworkService.viewHomework(req);

      res.status(status).json(resBody);
    } catch (err: unknown) {
      next(err);
    }
  }

  async getallHomeworkSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType = await this._homeworkService.getallSubmission(
        req.query,
      );

      res.status(status).json(resBody);
    } catch (err: unknown) {
      next(err);
    }
  }


  async updateSubmissionsByTeacher(req: Request, res: Response, next: NextFunction) {
      try {
      const { status, resBody }: serviceReturnType =
          await this._homeworkService.updateSubmission(req);

      res.status(status).json(resBody);
      } catch (err: unknown) {
      next(err);
      }
  }

  async deleteSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType =
        await this._homeworkService.deleteSubmission(req);

      res.status(status).json(resBody);
    } catch (err: unknown) {
      next(err);
    }
  }
}
