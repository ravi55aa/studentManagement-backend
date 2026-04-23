import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { TYPES } from '../DI/types';
import { serviceReturnType } from '../Constants/interfaces';
import { IHomeworkService } from '../Interfaces/services/IHomeworkService';
import { TPaginationQuery } from '../types/pagination';

@injectable()
export default class HomeworkController {
  constructor(
    @inject(TYPES.HomeworkService)
    private _homeworkService: IHomeworkService,
  ) {}

  async createHomework(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType = await this._homeworkService.createHomework(
        req,
        res,
      );

      res.status(status).json(resBody);
    } catch (err: unknown) {
      next(err);
    }
  }

  async getAllHomework(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, ...filter } = req.query as unknown as TPaginationQuery & Record<string, string>;

      const { status, resBody }: serviceReturnType = await this._homeworkService.listAllHomework(
        { page, limit } as TPaginationQuery,
        filter,
      );

      res.status(status).json(resBody);
    } catch (err: unknown) {
      next(err);
    }
  }

  async getOneHomework(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, resBody }: serviceReturnType = await this._homeworkService.getHomework(id!);

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

  async updateHomework(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType = await this._homeworkService.updateHomework(
        req,
        res,
      );

      res.status(status).json(resBody);
    } catch (err: unknown) {
      next(err);
    }
  }

  async deleteHomework(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; //homework_id
      const { status, resBody }: serviceReturnType = await this._homeworkService.deleteHomework(
        id!,
      );

      res.status(status).json(resBody);
    } catch (err: unknown) {
      next(err);
    }
  }
}
