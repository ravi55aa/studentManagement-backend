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
import { BadRequestError, InternalServerError, NotFoundError } from '@Middlewares/narrowDownErrors';
import logger from '@Utils/logger';

import { TPaginationQuery } from '../../types/pagination';

@injectable()
export class HomeworkService implements IHomeworkService {
  constructor(
    @inject(TYPES.HomeworkRepository)
    private _homeworkRepo: IHomeworkRepository,
  ) {}

  async createHomework(req: Request, res: Response): Promise<serviceReturnType> {
    try{
      const dto: Partial<IHomework> = HomeWorkDto.createHomework(req, res);
  
      //const validation=handleValidationOF(HomeworkSchema,dto,res);
  
      const doc = await this._homeworkRepo.createHomework(dto);
  
      return ApiResponse.success(doc, HomeworkMessage.HomeworkCreated);
    } catch(error){
      logger.error(HomeworkMessage.HomeworkNotCreated, error);
      throw new InternalServerError();
    }
  }

  async getHomework(id: string): Promise<serviceReturnType> {
    try{
      const doc = await this._homeworkRepo.findById(id!);
  
      if (!doc) {
        throw new BadRequestError(HomeworkMessage.HomeworkNotFound);
      }
  
      return ApiResponse.success(doc, HomeworkMessage.HomeworkFetched);
    } catch(error){
      logger.error(HomeworkMessage.HomeworkNotFound, error);
      throw new InternalServerError();
    }
  }

  async listAllHomework(
    paginationQuery: TPaginationQuery,
    query: FilterQuery<Partial<IHomework>>,
  ): Promise<serviceReturnType> {
    try{
      const docs = await this._homeworkRepo.getAllHomework(paginationQuery, query);
  
      if (!docs || docs.data.length === 0) {
        return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
      }
  
      return ApiResponse.success(docs, HomeworkMessage.HomeworkListed);
    } catch(error){
      logger.error(HomeworkMessage.HomeworkNotFound, error);
      throw new InternalServerError();
    }
  }

  async updateHomework(req: Request, res: Response): Promise<serviceReturnType> {
    try{
      const { homeworkId } = req.params;
  
      if (!homeworkId) {
        throw new NotFoundError(CommonMessage.IdNotFound);
      }
  
      const dto: Partial<IHomework> = HomeWorkDto.createHomework(req, res);
  
      const updatedDoc = await this._homeworkRepo.updateHomework(homeworkId!, dto);
  
      if (!updatedDoc) {
        throw new BadRequestError(HomeworkMessage.HomeworkNotUpdated);
      }
  
      return ApiResponse.success(updatedDoc, HomeworkMessage.HomeworkUpdated);
    } catch(error){
      logger.error(HomeworkMessage.HomeworkNotUpdated, error);
      throw new InternalServerError();
    }
  }

  async deleteHomework(id: string): Promise<serviceReturnType> {
    try{
      const deleted = await this._homeworkRepo.deleteHomework(id!);
  
      if (!deleted) {
        throw new BadRequestError(HomeworkMessage.HomeworkNotFound);
      }
  
      return ApiResponse.success(null, HomeworkMessage.HomeworkDeleted);
    } catch(error){
      logger.error(HomeworkMessage.HomeworkNotFound, error);
      throw new InternalServerError();
    }
  }

  async viewHomework(req: Request): Promise<serviceReturnType> {
      try{
        const { id } = req.params; //homeworkId
    
        const doc = await this._homeworkRepo.findById(id!);
    
        if (!doc) {
          throw new BadRequestError(HomeworkMessage.HomeworkNotFound);
        }
    
        return ApiResponse.success(doc, HomeworkMessage.HomeworkFetched);
      } catch(error){
        logger.error(HomeworkMessage.HomeworkNotFound, error);
        throw new InternalServerError();  
    }
  }
}