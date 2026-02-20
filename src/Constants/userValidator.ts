import { IAddress } from '../Models/addressModel';

import { UserRepository } from '../Repository/userRepository';

export class UserValidator {
  static async ensureUserIsTaken(repository: UserRepository, field: string) {
    const existing = await repository.findByEmail(field);
    if (existing) throw new Error('User already exist');
  }
}

export class AddressFormatter {
  static toPlain(address: Partial<IAddress>) {
    return address && typeof address.toObject === 'function' ? address.toObject() : address;
  }
}
