import { Request, Response } from 'express';
import { IAddress } from '@Models/addressModel';

import { SchoolAcademicYearDto } from './schoolDTO';

export class AddressDTO {
  static handleAddress(req: Request, res: Response): Partial<IAddress> {
    const { street, city, state, zip, country } = req.body;

    const { tenantId,role,adminId } = SchoolAcademicYearDto.getTenantId(req, res);

    return {
      city,
      street,
      state,
      country,
      zip,
      tenantId: tenantId,
      userId: adminId,
      userType: role
    };
  }

  static updateAddress(req: Request, res: Response): Partial<IAddress> {
    const { street, city, state, zip, country } = req.body;

    const {role,tenantId} = SchoolAcademicYearDto.getTenantId(req, res);

    const { id } = req.params;

    const updateYearDto: Partial<IAddress> = {
      ...(street !== undefined && { street }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(zip !== undefined && { zip }),
      ...(country !== undefined && { country }),

      userId: id,
      tenantId: tenantId,
      userType:role
    };

    return updateYearDto;
  }
}
