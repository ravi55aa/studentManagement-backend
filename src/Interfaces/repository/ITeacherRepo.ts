import { FilterQuery } from "mongoose";
import { ITeacher, ITeacherBio } from "../../Models/teacherModel";
import { BaseRepository } from "../../Repository/BaseRepository";
import { IGetAllTeachers } from "../Other/getAllTeachers";

export interface ITeacherRepo extends BaseRepository<ITeacherBio>{

        createProfessional(
                data:Partial<ITeacher>)
        : Promise<ITeacher | null>

        softDelete(
                query: FilterQuery<Partial<ITeacher>>)
        : Promise<boolean>

        getAllTeachers ()
        : Promise<IGetAllTeachers>

        getTeacherById(teacherId: string)
        :Promise<ITeacher|null>

        assignSubjects(
                teacherId: string,
                subjectIds: string[])
        : Promise<ITeacher | null>

        assignClass(
                teacherId: string,
                batchId: string,)
        : Promise<ITeacher | null>

        removeSubject(
                teacherId: string,
                subjectId: string)
        : Promise<ITeacher | null>
        
        removeSubject(
                teacherId: string,
                subjectId: string)
        : Promise<ITeacher | null>

        updateBioById(
        teacherId: string,
        data: Partial<ITeacherBio>
        ): Promise<ITeacherBio | null>


        getUnassignedTeachers()
        : Promise<ITeacherBio[]>
}