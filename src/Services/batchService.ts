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
import { BadRequestError, NotFoundError } from '@Middlewares/narrowDownErrors';
import { SchoolAcademicYearDto } from '@dto/schoolDTO';

import { TPaginationQuery } from '../types/pagination';

@injectable()
export class BatchService implements IBatchService {
  constructor(
    @inject(TYPES.BatchRepository)
    private _batchRepo: IBatchRepository,
  ) {}

  async createBatch(req: Request, res: Response): Promise<serviceReturnType> {
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
      logger.error('[BatchService:createBatch] Batch creation returned null', {
        tenantId: dto.tenantId,
        batchName: dto.name,
        batchCode: dto.code,
      });

      throw new BadRequestError(BatchMessage.BatchCreateFailed);
    }

    return ApiResponse.success(newBatchDoc, BatchMessage.BatchAdded);
  }

  async getBatchById(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;

    const doc = await this._batchRepo.findById(id!);

    if (!doc) {
      logger.warn('[BatchService:getBatchById] Batch not found', { batchId: id });

      throw new NotFoundError(BatchMessage.BatchNotFound);
    }

    return ApiResponse.success(doc, BatchMessage.BatchFetched);
  }

  async getAllBatches(req: Request, res: Response): Promise<serviceReturnType> {
    const query = BatchDto.handleGetAllBatchesDto(req, res);

    const { limit, page } = req.query as unknown as TPaginationQuery;

    const decoded = SchoolAcademicYearDto.getTenantId(req, res);

    const docs = await this._batchRepo.getAllBatches(
      { limit, page },
      {
        ...query,
        tenantId: decoded.tenantId,
        status: 'active',
      },
    );

    return ApiResponse.success(docs, BatchMessage.BatchListed);
  }

  async updateABatch(req: Request, res: Response): Promise<serviceReturnType> {
    const { id } = req.params;

    const dto = BatchDto.handleNewBatchDto(req, res);

    const updated = await this._batchRepo.updateBatch(id!, dto);

    if (!updated) {
      logger.warn('[BatchService:updateABatch] Batch not found during update', {
        batchId: id,
        payload: dto,
      });

      throw new NotFoundError(BatchMessage.BatchNotFound);
    }

    return ApiResponse.success(updated, BatchMessage.BatchUpdated);
  }

  async deleteBatch(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;

    const deleted = await this._batchRepo.deleteBatch(id!);

    if (!deleted) {
      logger.warn('[BatchService:deleteBatch] Batch not found during delete', {
        batchId: id,
      });

      throw new NotFoundError(BatchMessage.BatchNotFound);
    }

    return ApiResponse.success(null, BatchMessage.BatchDeleted);
  }

  async assignClassTeacher(batchId: string, teacherId: string): Promise<serviceReturnType> {
    if (!batchId || !teacherId) {
      logger.warn('[BatchService:assignClassTeacher] Invalid IDs provided', {
        batchId,
        teacherId,
      });

      throw new BadRequestError('Invalid ID');
    }

    const batch = await this._batchRepo.findById(batchId);

    if (!batch) {
      logger.warn('[BatchService:assignClassTeacher] Batch not found', {
        batchId,
        teacherId,
      });

      throw new NotFoundError(BatchMessage.BatchNotFound);
    }

    const updated = await this._batchRepo.assignTeacher(batchId, teacherId);

    if (!updated) {
      logger.error('[BatchService:assignClassTeacher] Failed to assign teacher', {
        batchId,
        teacherId,
      });

      throw new BadRequestError(BatchMessage.BatchUpdateFailed);
    }

    return ApiResponse.success(updated, BatchMessage.TeacherAssigned);
  }
}

// //** Relationship / Business Logic
// assignAdminToCenter() {}

// removeAdminFromCenter() {}

// assignSchoolToCenter() {}

// removeSchoolFromCenter() {}

// //**  Status & Lifecycle

// activateCenter() {}

// deactivateCenter() {}
