import { IStudent } from '@Models/Student/studentModel';
import { Request } from 'express';


export class StudentDTO {

    static createStudent(req: Request): Partial<IStudent> {

    const data: Partial<IStudent> = req.body;

    const profile = this.handleProfile(req);

    const returnData: Partial<IStudent> = {
        name: data.name!,
        email: data.email!,
        phone: data.phone!,
        dateOfBirth: data.dateOfBirth!,
        rollNumber: data.rollNumber!,
        gender: data.gender!,
        parentName: data.parentName!,
        parentPhone: data.parentPhone!,
        password: data.password!,
    
        profile: profile || "",
    };


        return returnData;
    }


    static updateStudent(req: Request): Partial<IStudent> {

        const data: Partial<IStudent> = req.body;

        const profile = this.handleProfile(req);

        const returnUpdated: Partial<IStudent> = {
        ...(data.name && {
            name: data.name,
        }),

        ...(data.email && {
            email: data.email,
        }),

        ...(data.phone && {
            phone: data.phone,
        }),

        ...(data.gender && {
            gender: data.gender,
        }),

        ...(data.parentName && {
            parentName: data.parentName,
        }),

        ...(data.parentPhone && {
            parentPhone: data.parentPhone,
        }),

        ...(data.status && {
            status: data.status,
        }),

        ...(data.dateOfBirth && {
            dateOfBirth: data.dateOfBirth!,
        }),

        ...(profile && {
            profile: profile,
        }),
        };

        return returnUpdated;
    }


    static handleProfile(req: Request) {

        const files = req.files as {
        profile?: Express.Multer.File[];
        };

        const profile = files?.profile?.[0]?.path;

        return profile;
    }
}