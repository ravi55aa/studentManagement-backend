import { FilterQuery, Types } from "mongoose";
import { teacherModel } from "../Models";
import { ITeacher, ITeacherBio, teacherBioModel } from "../Models/teacherModel"; 
import { BaseRepository } from "./BaseRepository";
import { ITeacherRepo } from "../Interfaces/repository/ITeacherRepo";
import logger from "../Utils/logger";
import { IGetAllTeachers } from "../Interfaces/Other/getAllTeachers";
import { batchModel } from "../Models/batchModel";
import { injectable } from "tsyringe";

@injectable()
export class TeacherRepository 
    extends BaseRepository<ITeacherBio> 
    implements ITeacherRepo  
    {

        constructor(){
            super(teacherBioModel)
        }

    /* --------CREATE----------- */

    public async createProfessional(data: Partial<ITeacher>)
    : Promise<ITeacher|null> 
    {
        try{
            const teacher = new teacherModel(data);
            await teacher.save();

            return teacher.toObject();
        } catch(err){
            logger.error(err);
            throw new Error(`Cannot create the teacher Error:${err}`)
        }
    }


    static async create(
        data: Partial<ITeacher>
    ): Promise<ITeacher> {
        try{
            const teacher = await teacherModel.create(data);
    
            return teacher.toObject();
        } catch(err){
            logger.error(err);
            throw new Error(`Cannot create the teacher Error:${err}`)
        }
    }



    /* ----------    FIND BY ID   ------------ */
    static async findById(
        teacherId: string
    ): Promise<ITeacher | null> {

        if (!Types.ObjectId.isValid(teacherId)) {
        return null;
        }

        return await teacherModel.findById(teacherId)
        .populate("classTeacherOf")
        .populate("assignedSubjects")
        .populate("academicYearId")
        .populate("centerId")
        .lean<ITeacher>();
    }
    

    public async getTeacherById(
    teacherId: string
    ):Promise<ITeacher|null> {
    return await teacherModel.findOne({teacherId:teacherId})
        .populate("centerId", "name")
        .populate("academicYearId", "year code")
        .populate("classTeacherOf", "name code")
        .populate("assignedSubjects", "name code")
        .lean();
    }



    /* ------------- FIND ONE (GENERIC) ----------------*/
    static async findOne(
        query: FilterQuery<Partial<ITeacher>>
    ): Promise<ITeacher | null> {

        return teacherModel.findOne(query).lean<ITeacher>();
    }



    /* -------------FIND MANY-----------------*/
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



    /* -----------SOFT DELETE------------- */

    public async softDelete(
        query: FilterQuery<Partial<ITeacher>>
    ): Promise<boolean> {

        const result = await teacherModel.findByIdAndUpdate(
        query,
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

    public async assignClass(
        teacherId: string,
        batchId: string,
    ): Promise<ITeacher | null> {

        return teacherModel.findByIdAndUpdate(
        teacherId,
        {
            $set: {
            classTeacherOf: batchId,
            },
        },
        { new: true }
        ).lean<ITeacher>();
    }


    /*-------UPDATE------ */
    
    public async updateBioById(
    teacherId: string,
    data: Partial<ITeacherBio>
    ): Promise<ITeacherBio | null> {
        
        if (!Types.ObjectId.isValid(teacherId)) {
            return null;
        }

        return teacherBioModel.findByIdAndUpdate(
            teacherId,
            { $set: data },
            { new: true }
        ).lean<ITeacherBio>();
    }


    public async getUnassignedTeachers() : Promise<ITeacherBio[]> 
    {
        const assignedTeacherIds = 
        await batchModel
            .find({ batchCounselor : { $ne: null } })
            .distinct("batchCounselor");

        const unassignedTeachers = await teacherBioModel
            .find({
            _id: { $nin: assignedTeacherIds }
            })
            .lean<ITeacherBio[]>();

        return unassignedTeachers;
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


    public async getAllTeachers (): Promise<IGetAllTeachers>{
        try{
            const a= await teacherBioModel.find({},{tenantId:0}).lean<ITeacherBio[]>();
    
            const b=await teacherModel.find({},{_id:0,}).lean<ITeacher[]>();
            
            const result:IGetAllTeachers={
                teacherBio:a,
                teachersSchoolData:b
            }
            return result

        } catch(err){
            logger.error(`Error: ${err}`);
            throw new Error(`Cant fetch Teachers, ${err}`);
        }
    }
}
