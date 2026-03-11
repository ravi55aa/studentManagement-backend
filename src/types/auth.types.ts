import { IUserRepository } from "@Interfaces/repository/IAdminRepository";
import { ISchoolRepository } from "@Interfaces/repository/ISchoolRepository";
import { ITeacherRepo } from "@Interfaces/repository/ITeacherRepo";

export type UserRole = 'School' | 'Student' | 'Teacher';

export type UserType = "Teacher" |'Admin' | 'School';

export type AuthPayloadType= {
    email:string,
    password:string,
    userType:UserType
}

export type IRepositoryMap={
    Teacher:ITeacherRepo|null,
    Admin:IUserRepository|null,
    School:ISchoolRepository|null,
}