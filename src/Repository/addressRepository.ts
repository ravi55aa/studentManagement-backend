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

  async updateAddress(
    query: FilterQuery<Partial<IAddress>>,
    data: Partial<IAddress>,
  ): Promise<IAddress | null> {
    try {
      return await addressModel
        .findOneAndUpdate(
          query,
          { $set: data },
          {
            new: true, // return updated document
            runValidators: true, // enforce schema validation
          },
        )
        .lean<IAddress>();
    } catch (error) {
      throw new Error('AddressRepository.updateAddress failed', { cause: error });
    }
  }
}
