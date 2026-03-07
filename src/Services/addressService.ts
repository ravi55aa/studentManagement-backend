import { FilterQuery } from 'mongoose';
import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';

import { TYPES } from '../DI/types';
import { IAddressService } from '../Interfaces/services/IAddressService';
import { IAddress } from '../Models/addressModel';
import { serviceReturnType } from '../Constants/interfaces';
import { AddressDTO } from '../dto/addressDTO';
import { ApiResponse } from '../Constants/apiResponse';
import { AddressMessage, ServerMessage } from '../Constants/resposeMessages';
import { IAddressRepository } from '../Interfaces/repository/IAddressRepository';
import logger from '../Utils/logger';

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
        return ApiResponse.notFound(AddressMessage.AddressNotFound);
      }

      return ApiResponse.success(address, AddressMessage.AddressFetched);
    } catch (error) {
      logger.error(AddressMessage.AddressNotFound, error);
      return ApiResponse.internalServerError(ServerMessage.ServerError);
    }
  }

  async getUserAddress(query: FilterQuery<Partial<IAddress>>): Promise<serviceReturnType> {
    try {
      const addresses = await this._addressRepository.findMany(query);

      return ApiResponse.success(addresses, AddressMessage.AddressListed);
    } catch (error) {
      logger.error(AddressMessage.AddressNotFound, error);
      return ApiResponse.internalServerError(ServerMessage.ServerError);
    }
  }

  async getAllAddressByQuery(query: FilterQuery<Partial<IAddress>>): Promise<serviceReturnType> {
    try {
      const addresses = await this._addressRepository.findMany(query);

      return ApiResponse.success(addresses, AddressMessage.AddressListed);
    } catch (error) {
      logger.error(AddressMessage.AddressNotFound, error);
      return ApiResponse.internalServerError(ServerMessage.ServerError);
    }
  }

  async getAddressById(id: string): Promise<serviceReturnType> {
    try {
      if (!id) {
        return ApiResponse.notFound(AddressMessage.AddressIdNotFound);
      }

      const address = await this._addressRepository.findOne({ userId: id });

      return ApiResponse.success(address, AddressMessage.AddressFetched);
    } catch (error) {
      logger.error(AddressMessage.AddressNotFound, error);
      return ApiResponse.internalServerError(ServerMessage.ServerError);
    }
  }

  async createAddress(address: Partial<IAddress>): Promise<serviceReturnType> {
    try {
      const created = await this._addressRepository.create(address);

      if (!created) {
        return ApiResponse.internalServerError(AddressMessage.AddressCreateFailed);
      }

      return ApiResponse.success(created, AddressMessage.AddressCreated);
    } catch (error) {
      logger.error(AddressMessage.AddressNotFound, error);
      return ApiResponse.internalServerError(ServerMessage.ServerError);
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
      return ApiResponse.internalServerError(ServerMessage.ServerError);
    }
  }
}
