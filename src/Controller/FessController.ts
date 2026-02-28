import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';

import { FeeService } from '../Services/feesService';
import { ApiResponse } from '../Constants/apiResponse';
import { AuthMessage } from '../Constants/resposeMessages';

@injectable()
export class FeeController {
  constructor(
    @inject(FeeService)
    private _feeService: FeeService,
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
        res.status(400).json({
          success: false,
          message: 'Fee ID is required',
        });
        return;
      }

      const { status, resBody } = await this._feeService.updateFee(id, req);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  /* --------------GET ALL FEES--------------- */
  public async getAllFees(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, resBody } = await this._feeService.getAllFees();

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
        const {status,resBody}=ApiResponse.notFound('UserIdNotFound');
        res.status(status).json(resBody);
      }

      const {status,resBody} = await this._feeService.getFeeById(id!);

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
        res.status(400).json({
          success: false,
          message: 'Fee ID is required',
        });
        return;
      }

      const { status, resBody } = await this._feeService.deleteFee(id);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }
}
