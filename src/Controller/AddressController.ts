import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';

import { IAddress } from '../Models/addressModel';
import { AddressDTO } from '../dto/addressDTO';
import { TYPES } from '../DI/types';
import { IAddressService } from '../Interfaces/services/IAddressService';

//resolve tokens
@injectable()
export class AddressController {
  constructor(
    @inject(TYPES.AddressService)
    private _addressService: IAddressService,
  ) {}

  public async getSchoolAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status, resBody } = await this._addressService.getSchoolAddress(id!);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  public async getAddressById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const { status, resBody } = await this._addressService.getAddressById(id!);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  public async getAllAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, resBody } = await this._addressService.getAllAddressByQuery({
        userType: req.query.userType,
      });

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  public async createAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: Partial<IAddress> = AddressDTO.handleAddress(req, res);

      const { status, resBody } = await this._addressService.createAddress(dto);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  public async updateAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, resBody } = await this._addressService.updateAddress(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  // public async deleteAddress(req:Request,res:Response,next:NextFunction):Promise<void>{
  //     try{

  //         const {status,resBody} = await this.addressService.deleteAddress(req,res);

  //         res.status(status).json(resBody);

  //     } catch(err) {
  //         next(err);
  //     }
  // }
}
