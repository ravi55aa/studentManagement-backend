import { FilterQuery } from 'mongoose';
import { Request, Response } from 'express';
import { injectable,inject } from 'tsyringe';

import { IAddressService } from '../Interfaces/services/IAddressService';
import { IAddress } from '../Models/addressModel';
import { serviceReturnType } from '../Constants/interfaces';
import { AddressDTO } from '../dto/addressDTO';
import { ApiResponse } from '../Constants/apiResponse';
import { AddressMessage } from '../Constants/resposeMessages';
import { IAddressRepository } from '../Interfaces/repository/IAddressRepository';
import { AddressRepository } from '../Repository/addressRepository';
import logger from '../Utils/logger';

@injectable()
export class AddressService implements IAddressService {
  
  constructor(
    @inject(AddressRepository)
    private _addressRepository: IAddressRepository,
  ) {}

  async getSchoolAddress(id: string): Promise<serviceReturnType> {
    try {
      const address = await this._addressRepository.findById(id);

      if (!address) {
        return ApiResponse.notFound(AddressMessage.AddressNotFound);
      }

      return ApiResponse.success(address, AddressMessage.AddressFetched);
    } catch (error) {
      logger.error(AddressMessage.AddressNotFound, error);
      return ApiResponse.failure('Internal server error');
    }
  }

  async getUserAddress(query: FilterQuery<Partial<IAddress>>): Promise<serviceReturnType> {
    try {
      const addresses = await this._addressRepository.findMany(query);

      return ApiResponse.success(addresses, AddressMessage.AddressListed);
    } catch (error) {
      logger.error(AddressMessage.AddressNotFound, error);
      return ApiResponse.failure('Internal server error');
    }
  }

  async getAllAddressByQuery(query: FilterQuery<Partial<IAddress>>): Promise<serviceReturnType> {
    try {
      const addresses = await this._addressRepository.findMany(query);

      return ApiResponse.success(addresses, AddressMessage.AddressListed);
    } catch (error) {
      logger.error(AddressMessage.AddressNotFound, error);
      return ApiResponse.failure('Internal server error');
    }
  }

  async getAddressById(id: string): Promise<serviceReturnType> {
    try {
      const address = await this._addressRepository.findOne({userId:id});

      return ApiResponse.success(address, AddressMessage.AddressFetched);
    } catch (error) {
      logger.error(AddressMessage.AddressNotFound, error);
      return ApiResponse.failure('Internal server error');
    }
  }

  async createAddress(address: Partial<IAddress>): Promise<serviceReturnType> {
    try {
      const created = await this._addressRepository.create(address);

      if (!created) {
        return ApiResponse.failure(AddressMessage.AddressCreateFailed);
      }

      return ApiResponse.success(created, AddressMessage.AddressCreated);
    } catch (error) {
      logger.error(AddressMessage.AddressNotFound, error);
      return ApiResponse.failure('Internal server error');
    }
  }

  //  Update Address (Admin | Teacher | Center | School)
  async updateAddress(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const dto = AddressDTO.updateAddress(req, res);

      const query = { userId: dto.userId };

      const updated = await this._addressRepository.updateAddress(query, dto);

      if (!updated) {
        return ApiResponse.notFound(AddressMessage.AddressNotFound);
      }

      return ApiResponse.success(updated, AddressMessage.AddressUpdated);
    } catch (error) {
      logger.error(AddressMessage.AddressNotFound, error);
      return ApiResponse.failure('Internal server error');
    }
  }
}
