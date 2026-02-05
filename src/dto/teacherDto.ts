import { ITeacher, ITeacherBio } from "../Models/teacherModel";
import {Request,Response} from "express";
import { handleTokenVerification } from "../Utils/jwt";
import { handleValidationOF } from "../Middlewares/validateUser.middleware";
import { createTeacherSchema } from "../Validators/teacher";
import { idToObjectId } from "../Repository/forgotPassword.Repository";

export class TeacherDTO {

    static createBio(req:Request,res:Response):Partial<ITeacherBio>{

        const data:Partial<ITeacherBio>=req.body;
        const decoded=handleTokenVerification(req,res);

        const returnUpdated:Partial<ITeacherBio>={
            firstName:data.firstName!,
            lastName:data.lastName!,
            email:data.email!,
            phone:data.phone!,
            qualification:data.qualification!,
            dateOfBirth:data.dateOfBirth!,
            profilePhoto:req?.file?.path || data.profilePhoto ||"",
            experience:data.experience!,
            gender:data.gender!,
            documents:data.documents||[],
            tenantId:decoded.tenantId
        }

        return returnUpdated;
    }

    static create(req:Request):Partial<ITeacher> {

        const data:Partial<ITeacher>=req.body;
        const {id}=req.params;


        return {
            teacherId: idToObjectId(id!),
            academicYearId: data.academicYearId!,
            employeeId: data.employeeId!,
            classTeacherOf: data.classTeacherOf!,
            employmentStatus: data.employmentStatus! ,
            assignedSubjects: data.assignedSubjects ?? [],
            designation: data.designation!,
            department: data.department ?? [],
            dateOfJoining: data.dateOfJoining!,
            centerId: data.centerId!
        };
    }

    static update(data:Partial<ITeacher>): Partial<ITeacher> {
        return data;
    }
}


export class TeacherValidation {

    static teacherBio(req:Request,res:Response):Partial<ITeacherBio>{

        const data:Partial<ITeacherBio>=req.body;
        const decoded=handleTokenVerification(req,res);

        const returnUpdated:Partial<ITeacherBio>={
            firstName:data.firstName!,
            lastName:data.lastName!,
            email:data.email!,
            phone:data.phone!,
            qualification:data.qualification!,
            dateOfBirth:data.dateOfBirth!,
            profilePhoto:req?.file?.path || data.profilePhoto ||"",
            experience:data.experience!,
            gender:data.gender!,
            documents:data.documents||[],
            tenantId:decoded.tenantId
        }

        return returnUpdated
    }

    static teacher(req:Request,res:Response) {

        const data=req.body;
        const {id}=req.params;


        const teacherData = {
            teacherId: id!,
            academicYearId: data.academicYearId!,
            employeeId: data.employeeId!,
            classTeacherOf: data.classTeacherOf!,
            employmentStatus: data.employmentStatus! ,
            assignedSubjects: data.assignedSubjects ?? [],
            designation: data.designation!,
            department: data.department ?? [],
            dateOfJoining: data.dateOfJoining!,
            centerId: data.centerId!
        };

        handleValidationOF(createTeacherSchema,
            teacherData,res);
        
    }

    static update(data:Partial<ITeacher>): Partial<ITeacher> {
        return data;
    }
}
