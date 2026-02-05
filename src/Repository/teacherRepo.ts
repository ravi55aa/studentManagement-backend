import { FilterQuery, Types } from "mongoose";
import { teacherModel } from "../Models";
import { ITeacher, ITeacherBio, teacherBioModel } from "../Models/teacherModel"; 
import { BaseRepository } from "./BaseRepository";
import { ITeacherRepo } from "../Interfaces/repository/ITeacherRepo";

export class TeacherRepository 
    extends BaseRepository<ITeacherBio> 
    implements ITeacherRepo  
    {

        constructor(){
            super(teacherBioModel)
        }

    /* ----------------------------------------
        CREATE
    ---------------------------------------- */

    public async createProfessional(data: Partial<ITeacher>)
    : Promise<ITeacher|null> 
    {
        const teacher = new teacherModel(data);
        await teacher.save();

        return teacher.toObject();
    }

    static async create(
        data: Partial<ITeacher>
    ): Promise<ITeacher> {

        const teacher = await teacherModel.create(data);

        return teacher.toObject();
    }


    /* ----------------------------------------
        FIND BY ID
    ---------------------------------------- */
    static async findById(
        teacherId: string
    ): Promise<ITeacher | null> {

        if (!Types.ObjectId.isValid(teacherId)) {
        return null;
        }

        return teacherModel.findById(teacherId)
        .populate("classTeacherOf")
        .populate("assignedSubjects")
        .populate("academicYearId")
        .populate("centerId")
        .lean<ITeacher>();
    }

    /* ----------------------------------------
        FIND ONE (GENERIC)
    ---------------------------------------- */
    static async findOne(
        query: FilterQuery<Partial<ITeacher>>
    ): Promise<ITeacher | null> {

        return teacherModel.findOne(query).lean<ITeacher>();
    }

    /* ----------------------------------------
        FIND MANY
    ---------------------------------------- */
    static async findMany(
        query:FilterQuery<Partial<ITeacher>>
    ): Promise<ITeacher[]> {

        return teacherModel.find(query)
        .populate("classTeacherOf")
        .populate("assignedSubjects")
        .populate("academicYearId")
        .populate("centerId")
        .lean<ITeacher[]>();
    }

    /* ----------------------------------------
        SOFT DELETE
    ---------------------------------------- */

    public async softDelete(
        teacherId: string
    ): Promise<boolean> {

        if (!Types.ObjectId.isValid(teacherId)) {
        return false;
        }

        const result = await teacherModel.findByIdAndUpdate(
        teacherId,
        {
            $set: {
            employmentStatus: "terminated",
            dateOfLeaving: new Date(),
            },
        }
        );

        return !!result;
    }

    /* ----------------------------------------
        ASSIGN SUBJECTS
    ---------------------------------------- */
    public async assignSubjects(
        teacherId: string,
        subjectIds: string[]
    ): Promise<ITeacher | null> {

        return teacherModel.findByIdAndUpdate(
        teacherId,
        {
            $addToSet: {
            assignedSubjects: { $each: subjectIds },
            },
        },
        { new: true }
        ).lean<ITeacher>();
    }

    /* ----------------------------------------
        REMOVE SUBJECT
    ---------------------------------------- */
    public async removeSubject(
        teacherId: string,
        subjectId: string
    ): Promise<ITeacher | null> {

        return teacherModel.findByIdAndUpdate(
        teacherId,
        {
            $pull: {
            assignedSubjects: subjectId,
            },
        },
        { new: true }
        ).lean<ITeacher>();
    }
    }
