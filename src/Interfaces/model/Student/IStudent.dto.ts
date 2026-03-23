import { Gender_types, Student_Status } from '../../../types/enum';

export interface IStudent {
  profile: string | null;
  email: string | null;
  password: string | null;
  name: string | null;
  gender: Gender_types;
  dateOfBirth: string | null;
  status: Student_Status;
  phone: string | null;
  parentName: string | null;
  parentPhone: string | null;
}
