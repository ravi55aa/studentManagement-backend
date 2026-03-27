import { FilterQuery } from 'mongoose';
import { injectable } from 'tsyringe';

import { IAddressRepository } from '../Interfaces/repository/IAddressRepository';
import { addressModel } from '../Models';
import { IAddress } from '../Models/addressModel';
import logger from '../Utils/logger';

import { BaseRepository } from './BaseRepository';

@injectable()
export class AddressRepository extends BaseRepository<IAddress> implements IAddressRepository {
  constructor() {
    super(addressModel);
  }

  // Update Address by Query (userId, etc...)
  async updateAddress(
    query: FilterQuery<Partial<IAddress>>,
    data: Partial<IAddress>,
  ): Promise<IAddress | null> {
    try {
      if (!query || Object.keys(query).length === 0) {
        return null;
      }

      return await this.model
        .updateOne(
          query,
          { $set: data },
          {
            upsert:true,
            runValidators: true,
          },
        )
        .lean<IAddress>();
    } catch (error) {
      logger.error('Error updating address:', error);
      return null;
    }
  }
}
