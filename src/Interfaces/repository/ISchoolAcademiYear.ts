import { FilterQuery } from "mongoose";
import { IAcademicSubject, IAcademicYear } from "../../Models/academicYear";

import { BaseRepository } from "../../Repository/BaseRepository"
import { IAcademicCourse, IAcademicCourseMeta } from "../../Models/courses.model";




export interface ISchoolAcademicYearRepo extends BaseRepository<IAcademicYear>
{
    addAcademicYear(centerData:Partial<IAcademicYear>):Promise<IAcademicYear|null>

    updateYear(query:FilterQuery<Partial<IAcademicYear>>,
        data:Partial<IAcademicYear>):Promise<IAcademicYear|null>
    
    getAllAcademicYear(query:FilterQuery<Partial<IAcademicYear>>):Promise<IAcademicYear[]>
}




export interface ISchoolSubjectsRepo extends BaseRepository<IAcademicSubject>
{
    addSubject(payload:Partial<IAcademicSubject>):Promise<IAcademicSubject|null>
    
    getAllSubjects(query:FilterQuery<Partial<IAcademicSubject>>):Promise<IAcademicSubject[]>

    updateSubject(query:FilterQuery<Partial<IAcademicSubject>>,
        data:Partial<IAcademicSubject>):Promise<IAcademicSubject|null>
}




export interface ISchoolCoursesRepo extends BaseRepository<IAcademicCourse>
{
    addNewCourse(model:String,payload:Partial<IAcademicCourse|IAcademicCourseMeta>):Promise<IAcademicCourse|IAcademicCourseMeta|null>

    addNewCourseMeta(payload:IAcademicCourseMeta):Promise<IAcademicCourseMeta|null>
    
    getAllCourses<T>(model:String,query:FilterQuery<Partial<T>>):Promise<T[]>

    updateCourse(model:String,query:FilterQuery<Partial<IAcademicCourse|IAcademicCourseMeta>>,
        data:Partial<IAcademicCourse|IAcademicCourseMeta>):Promise<IAcademicCourse|IAcademicCourseMeta|null>

    deleteCourse<T>(model:String,query:FilterQuery<Partial<T>>):Promise<T|null>

    findOneFromCourse(query: FilterQuery<Partial<IAcademicCourse>>): Promise<IAcademicCourse | null>

    findOneFromCourseMeta(query:FilterQuery<Partial<IAcademicCourseMeta>>):Promise<IAcademicCourseMeta|null>
}