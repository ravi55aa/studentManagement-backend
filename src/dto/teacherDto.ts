import { ITeacher, ITeacherBio } from "../Models/teacherModel";
import {Request,Response} from "express";
import { handleTokenVerification } from "../Utils/jwt";
import { handleValidationOF } from "../Middlewares/validateUser.middleware";
import { createTeacherSchema } from "../Validators/teacher";
import mongoose from "mongoose";
import { batchModel } from "../Models/batchModel";
import academicSubjectsModel, { academicYearModel } from "../Models/academicYear";
import { getRandomId } from "../Utils/nanoId";

export class TeacherDTO {

    static createBio(req:Request,res:Response):Partial<ITeacherBio>{

        const data:Partial<ITeacherBio>=req.body;
        const decoded=handleTokenVerification(req,res);
        const {docs,profile}=this.handleDocuments(req);

        const returnUpdated:Partial<ITeacherBio>={
            firstName:data.firstName!,
            lastName:data.lastName!,
            email:data.email!,
            phone:data.phone!,
            qualification:data.qualification!,
            dateOfBirth:data.dateOfBirth!,
            profilePhoto:profile  || "",
            experience:data.experience!,
            gender:data.gender!,
            documents:docs||[],
            tenantId:decoded.tenantId
        }

        return returnUpdated;
    }

    static handleDocuments(req:Request){
        
        const files = req.files as {
            profile?: Express.Multer.File[] ;
            docs?: Express.Multer.File[];
        };

        const  profile = files?.profile?.[0]?.path;
        const  documents = files?.docs;

        const docs = documents?.map((f) => ({
            url: f.path,
            fileName: f.filename,
        }));
        
        return {docs,profile}
    }

    static async create(req:Request):Promise<Partial<ITeacher>> {

        const data:Partial<ITeacher>=req.body;
        const {id}=req.params;
        let dto= {
            teacherId:new mongoose.Types.ObjectId(id!),
            academicYearId: data.academicYearId!,
            employeeId: data.employeeId!,
            classTeacherOf: data.classTeacherOf!,
            employmentStatus: data.employmentStatus! ,
            assignedSubjects: data.assignedSubjects ?? [],
            designation: data.designation!,
            department: data.department ?? [],
            dateOfJoining: data.dateOfJoining!,
            dateOfLeaving: data?.dateOfLeaving ?? null,
            centerId: data.centerId!
        };
        
        const batch = await batchModel.findOne({code:dto.classTeacherOf!});
        dto.classTeacherOf =batch?._id!;
        const yearDoc = await academicYearModel.findOne({code:dto.academicYearId!});


        dto.academicYearId = yearDoc?._id!;
        dto.classTeacherOf = batch?._id!;

        const subjectToFollowArray=[];
            for(let code of data.assignedSubjects!){
                const isSub=await academicSubjectsModel.findOne({code:code});
                if(!isSub) continue;

                subjectToFollowArray.push(isSub);
            }
        dto.assignedSubjects=subjectToFollowArray;
        dto.employeeId=getRandomId();

        return dto;
    }

    static update(data:Partial<ITeacher>): Partial<ITeacher> {
        return data;
    }


    static assignClass(req:Request): {teacherId:string,batchId:string }{
        const {teacherId}=req.params;
        const {batchId}=req.body

        return {teacherId:teacherId!,batchId:batchId};
    }
}


export class TeacherValidation {

    static teacherBio(req:Request,res:Response):Partial<ITeacherBio>{

        const data:Partial<ITeacherBio>=req.body;
        const decoded=handleTokenVerification(req,res);
        const {docs,profile}=TeacherDTO.handleDocuments(req);

        const returnUpdated:Partial<ITeacherBio>={
            firstName:data.firstName!,
            lastName:data.lastName!,
            email:data.email!,
            phone:data.phone!,
            qualification:data.qualification!,
            dateOfBirth:data.dateOfBirth!,
            profilePhoto: profile || "",
            experience:data.experience!,
            gender:data.gender!,
            documents:docs ||[],
            tenantId:decoded.tenantId
        }

        return returnUpdated
    }

    static async teacher(req:Request,res:Response) {

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

        //MOVE THIS DB-CODE into repository
        const year=await academicYearModel.findOne({code:data.academicYearId});
        teacherData.academicYearId=year?._id;

        const batch=await batchModel.findOne({code:data.classTeacherOf});
        teacherData.academicYearId=batch?._id;


        handleValidationOF(createTeacherSchema,
            teacherData,res);
        
    }

    static update(data:Partial<ITeacher>): Partial<ITeacher> {
        return data;
    }
}
