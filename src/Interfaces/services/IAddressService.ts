import { FilterQuery } from 'mongoose';
import { IAddress } from '../../Models/addressModel';
import { Response, Request } from 'express';
import { serviceReturnType } from '../../Constants/interfaces';

export interface IAddressService {
  getSchoolAddress(id: string | undefined): Promise<IAddress | null>;
  //tenantId:"schoolId"
  //role:"school"

  getUserAddress(query: FilterQuery<Partial<IAddress>>): Promise<IAddress[] | []>;
  //query : { userId=paramId, tenantId=schoolId}

  createAddress(address: Partial<IAddress>): Promise<IAddress | null>;

  updateAddress(req: Request, res: Response): Promise<serviceReturnType>;

  // deleteAddress(req:Request ,res:Response):Promise<serviceReturnType>
}
