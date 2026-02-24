import { FilterQuery } from 'mongoose';

import { IAddressService } from '../Interfaces/services/IAddressService';
import { IAddress } from '../Models/addressModel';

import { serviceReturnType } from '../Constants/interfaces';

import { AddressDTO } from '../dto/addressDTO';
import { Request, Response } from 'express';

import { AddressRepository } from '../Repository/addressRepository';

import { injectable, inject } from 'tsyringe';
import { ApiResponse } from '../Constants/apiResponse';
import { AddressMessage } from '../Constants/resposeMessages';

@injectable()
export class AddressService implements IAddressService {
  constructor(
    @inject(AddressRepository)
    private addressRepository: AddressRepository,
  ) {}

  async getSchoolAddress(id: string): Promise<serviceReturnType> {
    try {
      const address = await this.addressRepository.findById(id);

      if (!address) {
        return ApiResponse.notFound(AddressMessage.AddressNotFound);
      }

      return ApiResponse.success(address, AddressMessage.AddressFetched);
    } catch (error) {
      console.error('Error fetching school address:', error);
      return ApiResponse.failure('Internal server error');
    }
  }

  async getUserAddress(query: FilterQuery<Partial<IAddress>>): Promise<serviceReturnType> {
    try {
      const addresses = await this.addressRepository.findMany(query);

      return ApiResponse.success(addresses, AddressMessage.AddressListed);
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      return ApiResponse.failure('Internal server error');
    }
  }

  async createAddress(address: Partial<IAddress>): Promise<serviceReturnType> {
    try {
      const created = await this.addressRepository.create(address);

      if (!created) {
        return ApiResponse.failure(AddressMessage.AddressCreateFailed);
      }

      return ApiResponse.success(created, AddressMessage.AddressCreated);
    } catch (error) {
      console.error('Error creating address:', error);
      return ApiResponse.failure('Internal server error');
    }
  }

  //  Update Address (Admin | Teacher | Center | School)
  async updateAddress(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const dto = AddressDTO.updateAddress(req, res);

      const query = { userId: dto.userId };

      const updated = await this.addressRepository.updateAddress(query, dto);

      if (!updated) {
        return ApiResponse.notFound(AddressMessage.AddressNotFound);
      }

      return ApiResponse.success(updated, AddressMessage.AddressUpdated);
    } catch (error) {
      console.error('Error updating address:', error);
      return ApiResponse.failure('Internal server error');
    }
  }
}
