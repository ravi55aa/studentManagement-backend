import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { IFeeRepository } from 'Interfaces/repository/IFessRepository';
import { FeesMessage } from '@Constants/resposeMessages';
import { TYPES } from '@DI/types';
import { IFeeService } from '@Interfaces/services/IFeeService';
import { FeeDto } from '@dto/feesDto';
import { ApiResponse } from '@Constants/apiResponse';
import { serviceReturnType } from '@Constants/interfaces';
import { IFee } from '@Models/feesModel';
import { BadRequestError, InternalServerError, NotFoundError } from '@Middlewares/narrowDownErrors';
import logger from '@Utils/logger';
import { SchoolAcademicYearDto } from '@dto/schoolDTO';
//import { TPaginationQuery } from '../types/pagination';

import { TPaginationQuery } from '../types/pagination';

@injectable()
export class FeeService implements IFeeService {
  constructor(
    @inject(TYPES.FeeRepository)
    private _feeRepo: IFeeRepository,
  ) {}

  public async createFee(req: Request, res: Response): Promise<serviceReturnType> {
    const dto: Partial<IFee> = FeeDto.createFeeDto(req, res);

    const existing = await this._feeRepo.findOne({
      code: dto.code,
    });

    if (existing) {
      logger.warn('[FeeService:createFee] Fee code already exists', {
        feeCode: dto.code,
        feeName: dto.name,
      });

      throw new BadRequestError(FeesMessage.FeesCodeExist);
    }

    const newFee = await this._feeRepo.create(dto);

    if (!newFee) {
      logger.error('[FeeService:createFee] Failed to create fee', {
        payload: dto,
      });

      throw new InternalServerError();
    }

    return ApiResponse.created(newFee);
  }

  public async updateFee(id: string, req: Request): Promise<serviceReturnType> {
    const dto: Partial<IFee> = FeeDto.updateFeeDto(req);

    const updated = await this._feeRepo.updateById(id, dto);

    if (!updated) {
      logger.warn('[FeeService:updateFee] Fee not found during update', {
        feeId: id,
        payload: dto,
      });

      throw new NotFoundError(FeesMessage.FeesNotFound);
    }

    return ApiResponse.success(updated, FeesMessage.FeesUpdated);
  }

  public async getAllFees(req: Request,res:Response): Promise<serviceReturnType> {
    const { page, limit, ...filters } = req.query as unknown as TPaginationQuery &
      Record<string, string>;

    const {tenantId}=SchoolAcademicYearDto.getTenantId(req,res);

    const fees = await this._feeRepo.getAllFee({ page, limit }, 
      {...filters,tenantId:tenantId} );

    if (!fees || fees.data.length <= 0) {
      logger.warn('[FeeService:getAllFees] No fees found', {
        filters,
        page,
        limit,
      });

      throw new NotFoundError(FeesMessage.FeesNotFound);
    }

    return ApiResponse.success(fees, FeesMessage.FeesListed);
  }

  public async getFeeById(id: string): Promise<serviceReturnType> {
    const fee = await this._feeRepo.findById(id);

    if (!fee) {
      logger.warn('[FeeService:getFeeById] Fee not found', {
        feeId: id,
      });

      throw new NotFoundError(FeesMessage.FeesNotFound);
    }

    return ApiResponse.success(fee, FeesMessage.FeesListed);
  }

  public async deleteFee(id: string): Promise<serviceReturnType> {
    const deleted = await this._feeRepo.deleteById(id);

    if (!deleted) {
      logger.warn('[FeeService:deleteFee] Fee not found during delete', {
        feeId: id,
      });

      throw new NotFoundError(FeesMessage.FeesNotFound);
    }

    return ApiResponse.success(null, FeesMessage.FeesDeleted);
  }
}
