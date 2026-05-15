import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { IFeeService } from 'Interfaces/services/IFeeService';

import { TYPES } from '../DI/types';
import { ApiResponse } from '../Constants/apiResponse';
import { FeesMessage } from '../Constants/resposeMessages';

@injectable()
export default class FeeController {
  constructor(
    @inject(TYPES.FeeService)
    private _feeService: IFeeService,
  ) {}

  /* --------------CREATE FEE--------------- */
  public async createFee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, resBody } = await this._feeService.createFee(req, res);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  /* --------------UPDATE FEE--------------- */
  public async updateFee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        const { status, resBody } = ApiResponse.failure(FeesMessage.FeesIdNotFound);
        res.status(status).json(resBody);
      }

      const { status, resBody } = await this._feeService.updateFee(id!, req);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  /* --------------GET ALL FEES--------------- */
  public async getAllFees(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const { status, resBody } = await this._feeService.getAllFees(req,res);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  /* --------------GET FEE BY ID--------------- */
  public async getFeeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        const { status, resBody } = ApiResponse.failure(FeesMessage.FeesIdNotFound);
        res.status(status).json(resBody);
      }

      const { status, resBody } = await this._feeService.getFeeById(id!);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  /* --------------DELETE FEE (Soft Delete )--------------- */
  public async deleteFee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        const { status, resBody } = ApiResponse.failure(FeesMessage.FeesIdNotFound);
        res.status(status).json(resBody);
        return;
      }

      const { status, resBody } = await this._feeService.deleteFee(id);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }
}
