import schoolModel from '@Models/schoolModel';

import { UserRole } from '../types/auth.types';

// export function getUserModel(role: "School"): Model<ISchool>;
// export function getUserModel(role: "Student"): Model<IStudent>;

export function getUserModel(role: UserRole) {
  switch (role) {
    case 'School':
      return schoolModel;

    default:
      throw new Error('Invalid user role');
  }
}
