import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { ApiResponse } from '@Constants/apiResponse';
import { serviceReturnType } from '@Constants/interfaces';
import { CommonMessage, HomeworkMessage } from '@Constants/resposeMessages';
import { IHomework } from '@Interfaces/model/Teacher/IHomework';
import { IHomeworkService } from '@Interfaces/services/IHomeworkService';
import { TYPES } from '@DI/types';
import { IHomeworkRepository } from '@Interfaces/repository/IHomeworkRepository';
import { HomeWorkDto } from '@dto/homeworkDto';
import { FilterQuery } from 'mongoose';
import { BadRequestError, FailureError, NotFoundError } from '@Middlewares/narrowDownErrors';
import logger from '@Utils/logger';

import { TPaginationQuery } from '../../types/pagination';

@injectable()
export class HomeworkService implements IHomeworkService {
  constructor(
    @inject(TYPES.HomeworkRepository)
    private _homeworkRepo: IHomeworkRepository,
  ) {}

  async createHomework(req: Request, res: Response): Promise<serviceReturnType> {
    const dto: Partial<IHomework> = HomeWorkDto.createHomework(req, res);

    const doc = await this._homeworkRepo.createHomework(dto);

    if (!doc) {
      logger.error('[HomeworkService:createHomework] Failed to create homework', {
        payload: dto,
      });

      throw new FailureError(HomeworkMessage.HomeworkNotCreated);
    }

    return ApiResponse.success(doc, HomeworkMessage.HomeworkCreated);
  }

  async getHomework(id: string): Promise<serviceReturnType> {
    const doc = await this._homeworkRepo.findById(id);

    if (!doc) {
      logger.warn('[HomeworkService:getHomework] Homework not found', {
        homeworkId: id,
      });

      throw new NotFoundError(HomeworkMessage.HomeworkNotFound);
    }

    return ApiResponse.success(doc, HomeworkMessage.HomeworkFetched);
  }

  async listAllHomework(
    paginationQuery: TPaginationQuery,
    query: FilterQuery<Partial<IHomework>>,
  ): Promise<serviceReturnType> {
    const docs = await this._homeworkRepo.getAllHomework(paginationQuery, query);

    if (!docs || docs.data.length === 0) {
      logger.warn('[HomeworkService:listAllHomework] No homework found', {
        query,
        paginationQuery,
      });

      throw new NotFoundError(HomeworkMessage.HomeworkNotFound);
    }

    return ApiResponse.success(docs, HomeworkMessage.HomeworkListed);
  }

  async updateHomework(req: Request, res: Response): Promise<serviceReturnType> {
    const { homeworkId } = req.params;

    if (!homeworkId) {
      logger.warn('[HomeworkService:updateHomework] Homework ID missing');

      throw new NotFoundError(CommonMessage.IdNotFound);
    }

    const dto: Partial<IHomework> = HomeWorkDto.createHomework(req, res);

    const updatedDoc = await this._homeworkRepo.updateHomework(homeworkId, dto);

    if (!updatedDoc) {
      logger.warn('[HomeworkService:updateHomework] Failed to update homework', {
        homeworkId,
        payload: dto,
      });

      throw new BadRequestError(HomeworkMessage.HomeworkNotUpdated);
    }

    return ApiResponse.success(updatedDoc, HomeworkMessage.HomeworkUpdated);
  }

  async deleteHomework(id: string): Promise<serviceReturnType> {
    const deleted = await this._homeworkRepo.deleteHomework(id);

    if (!deleted) {
      logger.warn('[HomeworkService:deleteHomework] Homework not found during delete', {
        homeworkId: id,
      });

      throw new NotFoundError(HomeworkMessage.HomeworkNotFound);
    }

    return ApiResponse.success(null, HomeworkMessage.HomeworkDeleted);
  }

  async viewHomework(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;

    if (!id) {
      logger.warn('[HomeworkService:viewHomework] Homework ID missing');

      throw new NotFoundError(CommonMessage.IdNotFound);
    }

    const doc = await this._homeworkRepo.findById(id);

    if (!doc) {
      logger.warn('[HomeworkService:viewHomework] Homework not found', {
        homeworkId: id,
      });

      throw new NotFoundError(HomeworkMessage.HomeworkNotFound);
    }

    return ApiResponse.success(doc, HomeworkMessage.HomeworkFetched);
  }
}
