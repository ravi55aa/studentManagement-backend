import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';

import { TYPES } from '../DI/types';
import { serviceReturnType } from '../Constants/interfaces';
import { IBatches } from '../Models/batchModel';
import { BatchDto } from '../dto/batchDto';
import { IBatchService } from '../Interfaces/services/IBatchService';
import { ApiResponse } from '../Constants/apiResponse';
import { BatchMessage } from '../Constants/resposeMessages';
import logger from '../Utils/logger';
import { IBatchRepository } from '../Interfaces/repository/IBatchRepository';

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
        return ApiResponse.badRequest(BatchMessage.BatchExists);
      }

      const newBatchDoc = await this._batchRepo.addBatch(dto);

      if (!newBatchDoc) {
        return ApiResponse.failure(BatchMessage.BatchCreateFailed);
      }

      return ApiResponse.success(newBatchDoc, BatchMessage.BatchAdded);
    } catch (error) {
      logger.error('Error creating batch:', error);
      return ApiResponse.failure('Internal server error');
    }
  }

  async getBatchById(req: Request): Promise<serviceReturnType> {
    try {
      const { id } = req.params;

      const doc = await this._batchRepo.findById(id!);

      if (!doc) {
        return ApiResponse.notFound(BatchMessage.BatchNotFound);
      }

      return ApiResponse.success(doc, BatchMessage.BatchFetched);
    } catch (error) {
      logger.error('Error fetching batch:', error);
      return ApiResponse.failure('Internal server error');
    }
  }

  async getAllBatches(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const query = BatchDto.handleGetAllBatchesDto(req, res);

      const docs = await this._batchRepo.getAllBatches(query);

      return ApiResponse.success(docs, BatchMessage.BatchListed);
    } catch (error) {
      logger.error('Error fetching batches:', error);
      return ApiResponse.failure('Internal server error');
    }
  }

  async updateABatch(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const { id } = req.params;
      const dto = BatchDto.handleNewBatchDto(req, res);

      const updated = await this._batchRepo.updateBatch(id!, dto);

      if (!updated) {
        return ApiResponse.notFound(BatchMessage.BatchNotFound);
      }

      return ApiResponse.success(updated, BatchMessage.BatchUpdated);
    } catch (error) {
      logger.error('Error updating batch:', error);
      return ApiResponse.failure('Internal server error');
    }
  }

  async deleteBatch(req: Request): Promise<serviceReturnType> {
    try {
      const { id } = req.params;

      const deleted = await this._batchRepo.deleteBatch(id!);

      if (!deleted) {
        return ApiResponse.notFound(BatchMessage.BatchNotFound);
      }

      return ApiResponse.success(null, BatchMessage.BatchDeleted);
    } catch (error) {
      logger.error('Error deleting batch:', error);
      return ApiResponse.failure('Internal server error');
    }
  }

  async assignClassTeacher(batchId: string, teacherId: string): Promise<serviceReturnType> {
    try {
      if (!batchId || !teacherId) {
        return ApiResponse.badRequest('Invalid ID');
      }

      const batch = await this._batchRepo.findById(batchId);

      if (!batch) {
        return ApiResponse.notFound(BatchMessage.BatchNotFound);
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
        return ApiResponse.failure(BatchMessage.BatchUpdateFailed);
      }

      return ApiResponse.success(updated, BatchMessage.TeacherAssigned);
    } catch (error) {
      logger.error('Error assigning teacher:', error);
      return ApiResponse.failure('Internal server error');
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
