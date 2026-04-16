import { FilterQuery } from 'mongoose';
import { ITeacher, ITeacherBio } from '@Models/teacherModel';
import { BaseRepository } from '@Repository/BaseRepository';

import { IGetAllTeachers } from '../Other/getAllTeachers';
import { TPaginationQuery, TPaginationResult } from '../../types/pagination';

export interface ITeacherRepo extends BaseRepository<ITeacherBio> {
  createProfessional(data: Partial<ITeacher>): Promise<ITeacher | null>;

  getAllTeachers(paginationQuery:TPaginationQuery):
    Promise<TPaginationResult<IGetAllTeachers>|null>

  // getTeacherById(teacherId: string): Promise<ITeacher | null>;

  assignSubjects(teacherId: string, subjectIds: string[]): Promise<ITeacher | null>;

  softDelete(teacherId: string): Promise<boolean>;

  deleteTeacherBio(teacherId: string): Promise<boolean>;

  assignClass(teacherId: string, batchId: string): Promise<ITeacher | null>;

  removeSubject(teacherId: string, subjectId: string): Promise<ITeacher | null>;

  removeSubject(teacherId: string, subjectId: string): Promise<ITeacher | null>;

  updateBioById(teacherId: string, data: Partial<ITeacherBio>): Promise<ITeacherBio | null>;

  updateProfessionalByTeacherId(teacherId: string, data: Partial<ITeacher>): Promise<ITeacher | null>;

  getUnassignedTeachers(query: FilterQuery<Partial<ITeacher>>,paginationQuery:TPaginationQuery): Promise<TPaginationResult<ITeacherBio>|null>;

  findOneProfessional(query: FilterQuery<Partial<ITeacher>>): Promise<ITeacher | null>;

  findProfessionalById(teacherId: string): Promise<ITeacher | null>;
}
