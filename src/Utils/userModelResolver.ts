import schoolModel from '../Models/schoolModel';
import { UserRole } from '../types/auth.types';

export function getUserModel(role: UserRole) {
  switch (role) {
    case 'School':
      return schoolModel;

    //update teacher and student later

    default:
      throw new Error('Invalid user role');
  }
}
