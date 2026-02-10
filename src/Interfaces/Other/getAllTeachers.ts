import { ITeacher, ITeacherBio } from "../../Models/teacherModel";

export interface IGetAllTeachers{
    teacherBio:ITeacherBio[],
    teachersSchoolData:ITeacher[]
}