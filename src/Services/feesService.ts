import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';

import { IFeeService } from '../Interfaces/services/IFeeService';
import { FeeRepository } from '../Repository/feeRepository';
import { FeeDto } from '../dto/feesDto';
import { ApiResponse } from '../Constants/apiResponse';
import { serviceReturnType } from '../Constants/interfaces';
import { IFee } from '../Models/feesModel';

@injectable()
export class FeeService implements IFeeService {
  constructor(
    @inject(FeeRepository)
    private _feeRepo: FeeRepository,
  ) {}

  public async createFee(req: Request, res: Response): Promise<serviceReturnType> {
    const dto: Partial<IFee> = FeeDto.createFeeDto(req, res);

    // Check duplicate code
    const existing = await this._feeRepo.findOne({ code: dto.code });

    if (existing) {
      return ApiResponse.badRequest('Fee code already exists');
    }

    const newFee = await this._feeRepo.create(dto);

    return ApiResponse.created(newFee);
  }

  public async updateFee(id: string, req: Request): Promise<serviceReturnType> {
    const dto: Partial<IFee> = FeeDto.updateFeeDto(req);

    const updated = await this._feeRepo.updateById(id, dto);

    if (!updated) {
      return ApiResponse.notFound('Fee not found');
    }

    return ApiResponse.success(updated);
  }

  public async getAllFees(): Promise<serviceReturnType> {
    const fees = await this._feeRepo.findMany({});

    if (!fees.length) {
      return ApiResponse.notFound('No Fees Found');
    }

    return ApiResponse.success(fees);
  }

  public async getFeeById(id: string): Promise<serviceReturnType> {
    const fee = await this._feeRepo.findById(id);

    if (!fee) {
      return ApiResponse.notFound('Fee not found');
    }

    return ApiResponse.success(fee);
  }

  public async deleteFee(id: string): Promise<serviceReturnType> {
    const deleted = await this._feeRepo.deleteById(id);

    if (!deleted) {
      return ApiResponse.notFound('Fee not found');
    }

    return ApiResponse.success('Fee deleted successfully');
  }
}
