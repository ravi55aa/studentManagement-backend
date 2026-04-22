import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { IFeeRepository } from 'Interfaces/repository/IFessRepository';
import { FeesMessage } from '@Constants/resposeMessages';

import { TYPES } from '../DI/types';
import { IFeeService } from '../Interfaces/services/IFeeService';
import { FeeDto } from '../dto/feesDto';
import { ApiResponse } from '../Constants/apiResponse';
import { serviceReturnType } from '../Constants/interfaces';
import { IFee } from '../Models/feesModel';
import { TPaginationQuery } from '../types/pagination';

@injectable()
export class FeeService implements IFeeService {
  constructor(
    @inject(TYPES.FeeRepository)
    private _feeRepo: IFeeRepository,
  ) {}

  public async createFee(req: Request, res: Response): Promise<serviceReturnType> {
    const dto: Partial<IFee> = FeeDto.createFeeDto(req, res);

    // Check duplicate code
    const existing = await this._feeRepo.findOne({ code: dto.code });

    if (existing) {
      return ApiResponse.badRequest(FeesMessage.FeesCodeExist);
    }

    const newFee = await this._feeRepo.create(dto);

    return ApiResponse.created(newFee);
  }

  public async updateFee(id: string, req: Request): Promise<serviceReturnType> {
    const dto: Partial<IFee> = FeeDto.updateFeeDto(req);

    const updated = await this._feeRepo.updateById(id, dto);

    if (!updated) {
      return ApiResponse.notFound(FeesMessage.FeesNotFound);
    }

    return ApiResponse.success(updated, FeesMessage.FeesUpdated);
  }

  public async getAllFees(req: Request): Promise<serviceReturnType> {
    const { page, limit, ...filters } = req.query as unknown as any;

    const fees = await this._feeRepo.getAllFee({ page, limit }, filters || {});

    if (!fees || fees.data.length <= 0) {
      return ApiResponse.notFound(FeesMessage.FeesNotFound);
    }

    return ApiResponse.success(fees, FeesMessage.FeesListed);
  }

  public async getFeeById(id: string): Promise<serviceReturnType> {
    const fee = await this._feeRepo.findById(id);

    if (!fee) {
      return ApiResponse.notFound(FeesMessage.FeesNotFound);
    }

    return ApiResponse.success(fee, FeesMessage.FeesListed);
  }

  public async deleteFee(id: string): Promise<serviceReturnType> {
    const deleted = await this._feeRepo.deleteById(id);

    if (!deleted) {
      return ApiResponse.notFound(FeesMessage.FeesNotFound);
    }

    return ApiResponse.success(null, FeesMessage.FeesDeleted);
  }
}
