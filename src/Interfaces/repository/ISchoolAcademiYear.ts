import { FilterQuery } from 'mongoose';
import { IAcademicSubject, IAcademicYear } from '../../Models/academicYear';

import { BaseRepository } from '../../Repository/BaseRepository';
import { IAcademicCourse, IAcademicCourseMeta } from '../../Models/courses.model';

/**
 *
 * ACADEMIC-YEAR
 */
export interface ISchoolAcademicYearRepo extends BaseRepository<IAcademicYear> {
  addAcademicYear(centerData: Partial<IAcademicYear>): Promise<IAcademicYear | null>;

  updateYear(
    query: FilterQuery<Partial<IAcademicYear>>,
    data: Partial<IAcademicYear>,
  ): Promise<IAcademicYear | null>;

  getAllAcademicYear(query: FilterQuery<Partial<IAcademicYear>>): Promise<IAcademicYear[]>;

  deleteYear(id: string): Promise<boolean>;
}

/**
 *
 * ACADEMIC-SUBJECT
 */
export interface ISchoolSubjectsRepo extends BaseRepository<IAcademicSubject> {
  addSubject(payload: Partial<IAcademicSubject>): Promise<IAcademicSubject | null>;

  getAllSubjects(query: FilterQuery<Partial<IAcademicSubject>>): Promise<IAcademicSubject[]>;

  updateSubject(
    query: FilterQuery<Partial<IAcademicSubject>>,
    data: Partial<IAcademicSubject>,
  ): Promise<IAcademicSubject | null>;

  deleteSubject(id: string): Promise<boolean>;
}

/**
 *
 * ACADEMIC-COURSE
 */
export interface ISchoolCoursesRepo extends BaseRepository<IAcademicCourse> {
  createCourse(payload: Partial<IAcademicCourse>): Promise<IAcademicCourse | null>;

  createCourseMeta(payload: Partial<IAcademicCourseMeta>): Promise<IAcademicCourseMeta | null>;

  getAllCourses(query: FilterQuery<Partial<IAcademicCourse>>): Promise<IAcademicCourse[]>;

  getAllCourseMeta(
    query: FilterQuery<Partial<IAcademicCourseMeta>>,
  ): Promise<IAcademicCourseMeta[]>;

  updateCourse(
    query: FilterQuery<Partial<IAcademicCourse>>,
    data: Partial<IAcademicCourse>,
  ): Promise<IAcademicCourse | null>;

  updateCourseMeta(
    query: FilterQuery<Partial<IAcademicCourseMeta>>,
    data: Partial<IAcademicCourseMeta>,
  ): Promise<IAcademicCourseMeta | null>;

  deleteCourse(query: FilterQuery<Partial<IAcademicCourse>>): Promise<boolean>;

  deleteCourseMeta(query: FilterQuery<Partial<IAcademicCourseMeta>>): Promise<boolean>;

  findOneCourse(query: FilterQuery<Partial<IAcademicCourse>>): Promise<IAcademicCourse | null>;

  findOneCourseMeta(
    query: FilterQuery<Partial<IAcademicCourseMeta>>,
  ): Promise<IAcademicCourseMeta | null>;
}
