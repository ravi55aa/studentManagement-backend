import { Request, Response } from 'express';
import { IFee } from '../Models/feesModel';
import { handleTokenVerification } from '../Utils/jwt';

export class FeeDto {
  /* ------------CREATE FEE DTO------------------ */
  static createFeeDto(req: Request, res: Response): Partial<IFee> {
    const data = req.body;
    const decoded = handleTokenVerification(req, res);

    const returnData: Partial<IFee> = {
      name: data.name,
      code: data.code,

      type: data.type,

      appliesTo: {
        model: data.appliesTo?.model,
        id: data.appliesTo?.id,
      },

      status: data.status ?? 'ACTIVE',

      totalAmount: Number(data.totalAmount),

      dueDate: data.dueDate ? data.dueDate : undefined!,

      currency: data?.currency ?? 'INR',

      autoReminder: {
        enabled: data.autoReminder?.enabled ?? false,

        daysBeforeDue: data.autoReminder?.enabled
          ? Number(data.autoReminder?.daysBeforeDue)
          : undefined!,
      },

      tenantId: decoded.tenantId,
    };

    return returnData;
  }

  /* ----------------------------------------
        UPDATE FEE DTO
    ---------------------------------------- */
  static updateFeeDto(req: Request): Partial<IFee> {
    const data = req.body;

    const updateData: Partial<IFee> = {};

    if (data.name !== undefined) updateData.name = data.name;

    if (data.code !== undefined) updateData.code = data.code;

    if (data.type !== undefined) updateData.type = data.type;

    if (data.appliesTo !== undefined) {
      updateData.appliesTo = {
        model: data.appliesTo.model,
        id: data.appliesTo.id,
      };
    }

    if (data.status !== undefined) updateData.status = data.status;

    if (data.totalAmount !== undefined) updateData.totalAmount = Number(data.totalAmount);

    if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);

    if (data.currency !== undefined) updateData.currency = data.currency;

    if (data.autoReminder !== undefined) {
      updateData.autoReminder = {
        enabled: data.autoReminder.enabled ?? false,

        daysBeforeDue: data.autoReminder.enabled
          ? Number(data.autoReminder.daysBeforeDue)
          : undefined!,
      };
    }

    return updateData;
  }
}
