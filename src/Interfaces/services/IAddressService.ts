import { FilterQuery } from 'mongoose';
import { Response, Request } from 'express';

import { IAddress } from '../../Models/addressModel';
import { serviceReturnType } from '../../Constants/interfaces';

export interface IAddressService {
  getSchoolAddress(id: string): Promise<serviceReturnType>;

  getUserAddress(query: FilterQuery<Partial<IAddress>>): Promise<serviceReturnType>;

  getAddressById(id: string): Promise<serviceReturnType>;

  getAllAddressByQuery(query: FilterQuery<Partial<IAddress>>): Promise<serviceReturnType>;

  createAddress(address: Partial<IAddress>): Promise<serviceReturnType>;

  updateAddress(req: Request, res: Response): Promise<serviceReturnType>;

  // deleteAddress(req:Request ,res:Response):Promise<serviceReturnType>
}
