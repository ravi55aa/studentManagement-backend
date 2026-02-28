import { Request, Response } from 'express';

import { serviceReturnType } from '../../Constants/interfaces';

export interface ISchoolAcademicYear {
  addNewSchoolYear(req: Request, res: Response): Promise<serviceReturnType>;

  getAAcademicYear(req: Request): Promise<serviceReturnType>

  updateAcademicYear(req: Request, res: Response): Promise<serviceReturnType>;

  listAllAcademicYears(): Promise<serviceReturnType>;

  deleteAcademicYear(req: Request): Promise<serviceReturnType>;
}

export interface ISchoolAcademicSubjectSer {
  addAcademicSubject(req: Request, res: Response): Promise<serviceReturnType>;

  listAllAcademicSubjects(req: Request, res: Response): Promise<serviceReturnType>;

  getAnAcademicSubject(req: Request, res: Response): Promise<serviceReturnType>;

  updateAnAcademicSubject(req: Request, res: Response): Promise<serviceReturnType>;

  deleteAnAcademicSubject(req: Request, res: Response): Promise<serviceReturnType>;
}

export interface ISchoolAcademicCourseSer {
  createNewCourse(req: Request, res: Response): Promise<serviceReturnType>;

  listAllAcademicCourses(req: Request, res: Response): Promise<serviceReturnType>;

  getAnAcademicCourse(req: Request, res: Response): Promise<serviceReturnType>;

  updateAcademicCourse(req: Request, res: Response): Promise<serviceReturnType>;

  deleteAnAcademicCourse(req: Request, res: Response): Promise<serviceReturnType>;
}
