import { FilterQuery } from "mongoose";
import { ITeacher, ITeacherBio } from "../../Models/teacherModel";
import { BaseRepository } from "../../Repository/BaseRepository";

export interface ITeacherRepo extends BaseRepository<ITeacherBio>{

    createProfessional(
        data:Partial<ITeacher>
    ):Promise<ITeacher | null>

    softDelete(
        teacherId: string
    ): Promise<boolean>

    assignSubjects(
            teacherId: string,
            subjectIds: string[]
        ): Promise<ITeacher | null>

    removeSubject(
            teacherId: string,
            subjectId: string
        ): Promise<ITeacher | null>
}