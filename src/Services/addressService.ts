import { FilterQuery } from 'mongoose';
import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TYPES } from '@DI/types';
import { IAddressService } from '@Interfaces/services/IAddressService';
import { IAddress } from '@Models/addressModel';
import { serviceReturnType } from '@Constants/interfaces';
import { AddressDTO } from '@dto/addressDTO';
import { ApiResponse } from '@Constants/apiResponse';
import { AddressMessage } from '@Constants/resposeMessages';
import { IAddressRepository } from '@Interfaces/repository/IAddressRepository';
import logger from '@Utils/logger';
import { FailureError, InternalServerError, NotFoundError } from '@Middlewares/narrowDownErrors';

@injectable()
export class AddressService implements IAddressService {
  constructor(
    @inject(TYPES.AddressRepository)
    private _addressRepository: IAddressRepository,
  ) {}

  async getSchoolAddress(id: string): Promise<serviceReturnType> {
    try {
      const address = await this._addressRepository.findById(id);

      if (!address) {
        throw new NotFoundError(AddressMessage.AddressNotFound);
      }

      return ApiResponse.success(address, AddressMessage.AddressFetched);

    } catch (error) {
      logger.error(AddressMessage.AddressNotFound, error);
      throw new InternalServerError();
    }
  }

  async getUserAddress(query: FilterQuery<Partial<IAddress>>): Promise<serviceReturnType> {
    try {
      const addresses = await this._addressRepository.findMany(query);

      return ApiResponse.success(addresses, AddressMessage.AddressListed);
    } catch (error) {
      logger.error(AddressMessage.AddressNotFound, error);
      throw new InternalServerError();
    }
  }

  async getAllAddressByQuery(query: FilterQuery<Partial<IAddress>>): Promise<serviceReturnType> {
    try {
      const addresses = await this._addressRepository.findMany(query);

      return ApiResponse.success(addresses, AddressMessage.AddressListed);
    } catch (error) {
      logger.error(AddressMessage.AddressNotFound, error);
      throw new InternalServerError();
    }
  }

  async getAddressById(userId: string): Promise<serviceReturnType> {
    try {

      if (!userId) {
        throw new NotFoundError(AddressMessage.AddressIdNotFound);
      }

      const address = await this._addressRepository.findOne({ userId: userId });

      return ApiResponse.success(address, AddressMessage.AddressFetched);
    } catch (error) {
      logger.error(AddressMessage.AddressNotFound, error);
      throw new InternalServerError();
    }
  }

  async createAddress(address: Partial<IAddress>): Promise<serviceReturnType> {
    try {
      const created = await this._addressRepository.create(address);

      if (!created) {
        throw new FailureError(AddressMessage.AddressCreateFailed);
      }

      return ApiResponse.success(created, AddressMessage.AddressCreated);

    } catch (error) {

      logger.error(AddressMessage.AddressNotFound, error);

      throw new InternalServerError();
    }
  }

  //  Update Address (Admin | Teacher | Center | School)
  async updateAddress(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const dto = AddressDTO.updateAddress(req, res);

      const query = { userId: dto.userId };

      const updated = await this._addressRepository.updateAddress(query, dto);

      if (!updated) {
        throw new FailureError(AddressMessage.AddressNotUpdated); 
      }

      return ApiResponse.success(updated, AddressMessage.AddressUpdated);

    } catch (error) {

      logger.error(AddressMessage.AddressNotFound, error);
      
      throw new InternalServerError();
    }
  }
}
