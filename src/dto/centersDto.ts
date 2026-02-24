import { Request, Response } from 'express';
import { ICenter } from '../Models/centerModel';
import { handleTokenVerification } from '../Utils/jwt';

export class CenterDto {
  static handleNewCenterDto(req: Request, res: Response) {
    const { name, code, email, phone, totalCapacity, isMain, isActive, userModel, headInCharge } =
      req.body;

    const decodedToken = handleTokenVerification(req, res);

    const newCenterDto: Partial<ICenter> = {
      name,
      code: 'CEN-' + code,
      email,
      phone,
      totalCapacity,
      isMain,
      isActive,

      currentStrength: 0,
      tenantId: decodedToken?.tenantId,
      adminId: decodedToken?.userId,
      userModel,

      headInCharge: userModel == 'Admin' ? decodedToken?.userId : headInCharge,
    };

    return newCenterDto;
  }
}
