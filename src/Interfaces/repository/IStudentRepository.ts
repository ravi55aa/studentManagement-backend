import { IStudent } from "@Models/Student/studentModel"; 
import { BaseRepository } from "@Repository/BaseRepository";

export interface IStudentRepository extends BaseRepository<IStudent> {

    addStudent(studentData: Partial<IStudent>): Promise<IStudent | null>;

    findByAdmissionNumber(admissionNumber: string): Promise<IStudent | null>;

    findById(id: string): Promise<IStudent | null>;

    getAllStudents(): Promise<IStudent[]>;

    // getStudentsByQuery(query: Partial<IStudent>): Promise<IStudent[]>;

    updateStudent(id: string, updateData: Partial<IStudent>): Promise<IStudent | null>;

    deleteStudent(id: string): Promise<boolean>;
}