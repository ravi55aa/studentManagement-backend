import { Types } from "mongoose";

import {Request,Response} from "express";
import { ITeacher, ITeacherBio } from "../Models/teacherModel";
import { teacherModel } from "../Models";
import { TeacherDTO, TeacherValidation } from "../dto/teacherDto";
import { serviceReturnType } from "../Constants/interfaces";
import { ITeacherRepo } from "../Interfaces/repository/ITeacherRepo";
import { IResponse } from "../Interfaces/IResponse";
import { ITeacherService } from "../Interfaces/services/ITeacherService";
import { TeacherResponseBody } from "../Utils/ResponseBody/teacher.responseBody";


export class TeacherService implements ITeacherService{

    private teacherRepo:ITeacherRepo

    constructor(tr:ITeacherRepo){
        this.teacherRepo=tr;
    }

    /* ----------------------------------------
        CREATE TEACHER
  ---------------------------------------- */

    public async createTeacherBio (
            req:Request,res:Response
        ): Promise<serviceReturnType> {

            //VALIDATION
            TeacherValidation.teacherBio(req,res);

            //DTO
            const data=TeacherDTO.createBio(req,res);
            
            if (data.email && data.phone) {
                const exists = await this.teacherRepo.findOne({
                    email: data.email,
                    phone: data.phone,
                });

                if (exists) {
                    throw new Error("Class teacher already Exist with the provided credentials");
                }
            }
            
            const newTeacher:ITeacherBio | null=await this.teacherRepo.create(data);

            const {status,resBody}=TeacherResponseBody.createTeacher<ITeacherBio>(newTeacher);
            
        return {status,resBody};
    }


    public async createTeacher (
        req:Request,res:Response
    ): Promise<serviceReturnType> {

        TeacherValidation.teacher(req,res);
        
        const data=TeacherDTO.create(req);
        
        if (data.classTeacherOf && data.academicYearId) {
            const exists = await this.teacherRepo.findOne({
                classTeacherOf: data.classTeacherOf,
                academicYearId: data.academicYearId,
                employmentStatus: "active",
            });

            if (exists) {
                throw new Error("Class teacher already assigned for this batch");
            }
        }

        const newTeacher:ITeacher|null=await this.teacherRepo.createProfessional(data);

        const {status,resBody}=TeacherResponseBody.createTeacher<ITeacher>(newTeacher);
        
        return {status,resBody};
    }

    /* ----------------------------------------
        UPDATE TEACHER
  ---------------------------------------- */
    static async updateTeacher(
        teacherId: string,
        updateData: Partial<ITeacher>
    ): Promise<ITeacher> {

        if (!Types.ObjectId.isValid(teacherId)) {
        throw new Error("Invalid teacher id");
        }

    // Prevent reassignment conflict
    if (updateData.classTeacherOf && updateData.academicYearId) {
        const exists = await teacherModel.findOne({
            _id: { $ne: teacherId },
            classTeacherOf: updateData.classTeacherOf,
            academicYearId: updateData.academicYearId,
            employmentStatus: "active",
        });

        if (exists) {
            throw new Error("Another teacher is already class teacher for this batch");
        }
        }

    const updated = await teacherModel.findByIdAndUpdate(
        teacherId,
        { $set: updateData },
        { new: true }
        ).lean<ITeacher>();

        if (!updated) {
        throw new Error("Teacher not found");
        }

        return updated;
    }

    /* ----------------------------------------
        DELETE TEACHER (SOFT DELETE)
  ---------------------------------------- */
    static async deleteTeacher(
        teacherId: string
    ): Promise<void> {

        if (!Types.ObjectId.isValid(teacherId)) {
        throw new Error("Invalid teacher id");
        }

        const deleted = await teacherModel.findByIdAndUpdate(
        teacherId,
        {
            $set: {
            employmentStatus: "terminated",
            dateOfLeaving: new Date(),
            },
        }
        );

        if (!deleted) {
        throw new Error("Teacher not found");
        }
    }

    /* ----------------------------------------
        FETCH ALL TEACHERS
  ---------------------------------------- */
    static async fetchAllTeachers(
        tenantId: string,
        filters: {
        academicYearId?: string;
        centerId?: string;
        department?: string;
        employmentStatus?: string;
        batchId?: string;
        } = {}
    ): Promise<ITeacher[]> {

        const query: any = { tenantId };

        if (filters.academicYearId)
        query.academicYearId = filters.academicYearId;

        if (filters.centerId)
        query.centerId = filters.centerId;

        if (filters.department)
        query.department = filters.department;

        if (filters.employmentStatus)
        query.employmentStatus = filters.employmentStatus;

        if (filters.batchId)
        query.classTeacherOf = filters.batchId;

        return teacherModel.find(query)
        .populate("classTeacherOf")
        .populate("assignedSubjects")
        .populate("academicYearId")
        .populate("centerId")
        .lean<ITeacher[]>();
    }

    /* ----------------------------------------
        FETCH SINGLE TEACHER
  ---------------------------------------- */
    static async fetchTeacherById(
        teacherId: string
    ): Promise<ITeacher> {

        if (!Types.ObjectId.isValid(teacherId)) {
        throw new Error("Invalid teacher id");
        }

        const teacher = await teacherModel.findById(teacherId)
        .populate("classTeacherOf")
        .populate("assignedSubjects")
        .populate("academicYearId")
        .populate("centerId")
        .lean<ITeacher>();

        if (!teacher) {
        throw new Error("Teacher not found");
        }

        return teacher;
    }

    /* ----------------------------------------
        ASSIGN SUBJECTS TO TEACHER
  ---------------------------------------- */
    static async assignSubjects(
        teacherId: string,
        subjectIds: string[]
    ): Promise<ITeacher> {

        const updated = await teacherModel.findByIdAndUpdate(
        teacherId,
        {
            $addToSet: {
            assignedSubjects: { $each: subjectIds },
            },
        },
        { new: true }
        ).lean<ITeacher>();

        if (!updated) {
        throw new Error("Teacher not found");
        }

        return updated;
    }

    /* ----------------------------------------
        REMOVE SUBJECT FROM TEACHER
  ---------------------------------------- */
    static async removeSubject(
        teacherId: string,
        subjectId: string
    ): Promise<ITeacher> {

        const updated = await teacherModel.findByIdAndUpdate(
        teacherId,
        {
            $pull: {
            assignedSubjects: subjectId,
            },
        },
        { new: true }
        ).lean<ITeacher>();

        if (!updated) {
        throw new Error("Teacher not found");
        }

        return updated;
    }
}
