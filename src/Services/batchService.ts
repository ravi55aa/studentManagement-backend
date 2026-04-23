import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TYPES } from '@DI/types';
import { serviceReturnType } from '@Constants/interfaces';
import { IBatches } from '@Models/batchModel';
import { BatchDto } from '@dto/batchDto';
import { IBatchService } from '@Interfaces/services/IBatchService';
import { ApiResponse } from '@Constants/apiResponse';
import { BatchMessage } from '@Constants/resposeMessages';
import logger from '@Utils/logger';
import { IBatchRepository } from '@Interfaces/repository/IBatchRepository';
import { BadRequestError, 
  InternalServerError, 
  NotFoundError } from '@Middlewares/narrowDownErrors';

import { TPaginationQuery } from '../types/pagination';

@injectable()
export class BatchService implements IBatchService {
  constructor(
    @inject(TYPES.BatchRepository)
    private _batchRepo: IBatchRepository,
  ) {}

  async createBatch(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const dto: Partial<IBatches> = BatchDto.handleNewBatchDto(req, res);

      const existing = await this._batchRepo.findOne({
        tenantId: dto.tenantId,
        name: dto.name,
        code: dto.code,
      });

      if (existing) {
        throw new BadRequestError(BatchMessage.BatchExists);
      }

      const newBatchDoc = await this._batchRepo.addBatch(dto);

      if (!newBatchDoc) {
        throw new BadRequestError(BatchMessage.BatchCreateFailed);
      }

      return ApiResponse.success(newBatchDoc, BatchMessage.BatchAdded);

    } catch (error) {

      logger.error('Error creating batch:', error);

      throw new InternalServerError();
    }
  }

  async getBatchById(req: Request): Promise<serviceReturnType> {
    try {
      const { id } = req.params;

      const doc = await this._batchRepo.findById(id!);

      if (!doc) {
        throw new NotFoundError(BatchMessage.BatchNotFound);
      }

      return ApiResponse.success(doc, BatchMessage.BatchFetched);
      
    } catch (error) {
      logger.error('Error fetching batch:', error);
      throw new InternalServerError();
    }
  }

  async getAllBatches(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const query = BatchDto.handleGetAllBatchesDto(req, res);

      const { limit, page } = req.query as unknown as TPaginationQuery;

      const docs = await this._batchRepo.getAllBatches({ limit, page }, query);

      return ApiResponse.success(docs, BatchMessage.BatchListed);
    } catch (error) {
      logger.error('Error fetching batches:', error);
      throw new InternalServerError();
    }
  }

  async updateABatch(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const { id } = req.params;
      const dto = BatchDto.handleNewBatchDto(req, res);

      const updated = await this._batchRepo.updateBatch(id!, dto);

      if (!updated) {
        throw new NotFoundError(BatchMessage.BatchNotFound);
      }

      return ApiResponse.success(updated, BatchMessage.BatchUpdated);
    } catch (error) {
      logger.error('Error updating batch:', error);
      throw new InternalServerError();
    }
  }

  async deleteBatch(req: Request): Promise<serviceReturnType> {
    try {
      const { id } = req.params;

      const deleted = await this._batchRepo.deleteBatch(id!);

      if (!deleted) {
        throw new NotFoundError(BatchMessage.BatchNotFound);
      }

      return ApiResponse.success(null, BatchMessage.BatchDeleted);
    } catch (error) {
      logger.error('Error deleting batch:', error);
      throw new InternalServerError();
    }
  }

  async assignClassTeacher(batchId: string, teacherId: string): Promise<serviceReturnType> {
    try {
      if (!batchId || !teacherId) {
        throw new BadRequestError('Invalid ID');
      }

      const batch = await this._batchRepo.findById(batchId);

      if (!batch) {
        throw new NotFoundError(BatchMessage.BatchNotFound);
      }

      //? VERIFY: WHY THIS CHECK ?
      // if (batch.batchCounselor) {
      //   return ApiResponse.badRequest(BatchMessage.BatchAlreadyHasTeacher);
      // }

      //const teacherAlreadyAssigned = await this._batchRepo.findByTeacherId(teacherId);

      // if (teacherAlreadyAssigned) {
      //   return ApiResponse.badRequest(BatchMessage.TeacherAlreadyAssigned);
      // }

      const updated = await this._batchRepo.assignTeacher(batchId, teacherId);

      if (!updated) {
        throw new BadRequestError(BatchMessage.BatchUpdateFailed);
      }

      return ApiResponse.success(updated, BatchMessage.TeacherAssigned);
    } catch (error) {
      logger.error('Error assigning teacher:', error);
      throw new InternalServerError();
    }
  }
}

// //** Relationship / Business Logic
// assignAdminToCenter() {}

// removeAdminFromCenter() {}

// assignSchoolToCenter() {}

// removeSchoolFromCenter() {}

// //** 📌 Status & Lifecycle

// activateCenter() {}

// deactivateCenter() {}
