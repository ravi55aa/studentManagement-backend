import { FilterQuery } from "mongoose";
import { ISchoolAcademicYearRepo, ISchoolCoursesRepo, ISchoolSubjectsRepo } from "../Interfaces/repository/ISchoolAcademiYear";
import academicSubjectsModel, { academicYearModel, IAcademicSubject, IAcademicYear } from "../Models/academicYear";
import { BaseRepository } from "./BaseRepository";
import coursesModel, { coursesMetaModel, IAcademicCourse, IAcademicCourseMeta } from "../Models/courses.model";


export class AcademicYearRepository extends BaseRepository<IAcademicYear> implements ISchoolAcademicYearRepo {
    constructor(){
            super(academicYearModel);
        }

        async addAcademicYear(centerData:IAcademicYear):Promise<IAcademicYear|null> {
            return await academicYearModel.create(centerData);
        }
    
        async getAllAcademicYear():Promise<IAcademicYear[]>{
            return await academicYearModel.find().lean<IAcademicYear[]>();
        }

        async updateYear(query: FilterQuery<Partial<IAcademicYear>>, data: Partial<IAcademicYear>): Promise<IAcademicYear | null> {
            return await academicYearModel.updateOne(query,data).lean<IAcademicYear>();
        }
}



export class AcademicSubjectRepository extends BaseRepository<IAcademicSubject>
implements ISchoolSubjectsRepo {
    
    constructor(){
            super(academicSubjectsModel);
        }

        async addSubject(payload:IAcademicSubject):Promise<IAcademicSubject|null> {
            return await academicSubjectsModel.create(payload);
        }
    
        async getAllSubjects():Promise<IAcademicSubject[]>{
            return await academicSubjectsModel.find()
            .sort({ createdAt: -1 })
            .lean<IAcademicSubject[]>();
        }

        async updateSubject(query: FilterQuery<Partial<IAcademicSubject>>, data: Partial<IAcademicSubject>): Promise<IAcademicSubject | null> {
            return await academicSubjectsModel.updateOne(query,data).lean<IAcademicSubject>();
        }
}


export class AcademicCourseRepository 
extends     BaseRepository<IAcademicCourse> 
implements ISchoolCoursesRepo {
    
    constructor(){
            super(coursesModel);
        }



        async addNewCourse(model:String,payload:Partial<IAcademicCourse|IAcademicCourseMeta>):Promise<IAcademicCourse|IAcademicCourseMeta|null> {
            if(model=="AcademicCourse"){
                return await coursesModel.create(payload);
            }else{
                return await coursesMetaModel.create(payload);
            }
        }


        async addNewCourseMeta(payload:Partial<IAcademicCourseMeta>):Promise<IAcademicCourseMeta|null> {
            return await coursesMetaModel.create(payload);
        }
    

        async getAllCourses<T>(model:String,query:FilterQuery<Partial<T>>):Promise<T[]>{

            if(model=="AcademicCourse"){
                return await coursesModel.find(query).lean<T[]>();
            } else {
                return await coursesMetaModel.find(query).lean<T[]>();
            }
        }


        async deleteCourse<T>(model:String,query:FilterQuery<Partial<T>>): Promise<T | null> 
        {
            if(model=="AcademicCourse"){
                return await coursesModel.deleteOne(query).lean<T>();
            } else {
                return await coursesMetaModel.deleteOne(query).lean<T>();
            }
        }

        async findOneFromCourse(query: FilterQuery<Partial<IAcademicCourse>>): Promise<IAcademicCourse | null> {
            return await coursesModel.findOne(query).populate("academicYear").lean<IAcademicCourse>();
        } //later update 
        // ["batches","subjects"] = ["batches","subjects","coordinators","attachment(doubt)"];


        async findOneFromCourseMeta(query: FilterQuery<Partial<IAcademicCourseMeta>>): Promise<IAcademicCourseMeta | null> {
            return await coursesMetaModel.findOne(query).populate("batches subjects").lean<IAcademicCourseMeta>();
        };


        async updateCourse(model:String,query:FilterQuery<Partial<IAcademicCourse|IAcademicCourseMeta>>,
        data:Partial<IAcademicCourse|IAcademicCourseMeta>):Promise<IAcademicCourse|IAcademicCourseMeta|null> {
            if(model=="AcademicCourse"){
                return await coursesModel.updateOne(query,data).lean<IAcademicCourse>();
            }else{
                return await coursesMetaModel.updateOne(query,data).lean<IAcademicCourseMeta>();
            }
        }
}
