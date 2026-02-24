import { FilterQuery } from 'mongoose';
import { IAddress } from '../../Models/addressModel';
import { Response, Request } from 'express';
import { serviceReturnType } from '../../Constants/interfaces';

export interface IAddressService {
  getSchoolAddress(id: string): Promise<serviceReturnType>;

  getUserAddress(query: FilterQuery<Partial<IAddress>>): Promise<serviceReturnType>;

  createAddress(address: Partial<IAddress>): Promise<serviceReturnType>;

  updateAddress(req: Request, res: Response): Promise<serviceReturnType>;

  // deleteAddress(req:Request ,res:Response):Promise<serviceReturnType>
}
