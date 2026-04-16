import { ISuperAdminRepository, IUserRepository } from '@Interfaces/repository/IAdminRepository';
import { ISchoolRepository } from '@Interfaces/repository/ISchoolRepository';
import { IStudentRepository } from '@Interfaces/repository/IStudentRepository';
import { ITeacherRepo } from '@Interfaces/repository/ITeacherRepo';

export type UserRole = 'SuperAdmin' | 'School' | 'Admin' | 'Teacher' | 'Student';

export type UserType = 'SuperAdmin' |'Teacher' | 'Admin' | 'School' | 'Student';

export type AuthPayloadType = {
  email: string;
  password: string;
  userType: UserType;
};  

export type IRepositoryMap = {
  Teacher: ITeacherRepo | null;
  Admin: IUserRepository | null;
  School: ISchoolRepository | null;
  Student: IStudentRepository | null;
  SuperAdmin: ISuperAdminRepository | null;
};
