import { FilterQuery } from 'mongoose';
import { IAddressRepository } from '../Interfaces/repository/IAddressRepository';
import { addressModel } from '../Models';
import { IAddress } from '../Models/addressModel';
import { BaseRepository } from './BaseRepository';
import { injectable } from 'tsyringe';

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
        .findOneAndUpdate(
          query,
          { $set: data },
          {
            new: true,
            runValidators: true,
          },
        )
        .lean<IAddress>();
    } catch (error) {
      console.error('Error updating address:', error);
      return null;
    }
  }
}
