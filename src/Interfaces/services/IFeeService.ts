import { Request, Response } from 'express';

import { serviceReturnType } from '../../Constants/interfaces';

export interface IFeeService {
  createFee(req: Request, res: Response): Promise<serviceReturnType>;

  updateFee(id: string, req: Request): Promise<serviceReturnType>;

  getAllFees(req: Request): Promise<serviceReturnType>;

  getFeeById(id: string): Promise<serviceReturnType>;

  deleteFee(id: string): Promise<serviceReturnType>;
}
