import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { SchoolAcademicYearDto } from '@dto/schoolDTO';

import { serviceReturnType } from '../Constants/interfaces';
import coursesModel, { coursesMetaModel, IAcademicCourseMeta } from '../Models/courses.model';
import {
  ISchoolAcademicCourseSer,
  ISchoolAcademicSubjectSer,
  ISchoolAcademicYear,
} from '../Interfaces/services/ISchoolAcademicYear';
import { ApiResponse } from '../Constants/apiResponse';
import { CourseMessage } from '../Constants/resposeMessages';
import { TYPES } from '../DI/types';
import { TPaginationQuery } from '../types/pagination';

/******** SCHOOL YEAR********/
@injectable()
export class SchoolAcademicController {
  constructor(
    @inject(TYPES.SchoolYearService)
    private _academicService: ISchoolAcademicYear,
  ) {}

  async addNewYear(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType = await this._academicService.addNewSchoolYear(
        req,
        res,
      );

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async getASchoolAcademicYear(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType =
        await this._academicService.getAAcademicYear(req);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async listAllAcademicYear(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as TPaginationQuery;

      const {tenantId,adminId}=SchoolAcademicYearDto.getTenantId(req,res);

      const { status, resBody } = await this._academicService.listAllAcademicYears(query,{tenantId,adminId});

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async editAnAcademicYearById(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._academicService.updateAcademicYear(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async deleteAnSchoolAcademicYearById(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._academicService.deleteAcademicYear(req);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }
}

@injectable()
/******** SCHOOL SUBJECTS********/
export class SchoolAcademicSubjectController {
  constructor(
    @inject(TYPES.SchoolAcademicSubjectService)
    private _service: ISchoolAcademicSubjectSer,
  ) {}

  async addNewSchoolSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType = await this._service.addAcademicSubject(
        req,
        res,
      );

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async listAllSchoolAcademicSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._service.listAllAcademicSubjects(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  //Pending*****

  async getASchoolAcademicSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType = await this._service.getAnAcademicSubject(
        req,
        res,
      );

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async editASchoolAcademicSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._service.updateAnAcademicSubject(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async deleteASchoolAcademicSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._service.deleteAnAcademicSubject(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }
}

/******** SCHOOL SUBJECTS********/
@injectable()
export class SchoolAcademicCourseController {
  constructor(
    @inject(TYPES.SchoolAcademicCoursesService)
    private _courseService: ISchoolAcademicCourseSer,
  ) {}

  async addNewSchoolCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType = await this._courseService.createNewCourse(
        req,
        res,
      );

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async listAllSchoolAcademicCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const {tenantId}=SchoolAcademicYearDto.getTenantId(req,res);

      const courses = await coursesModel.find({tenantId}).lean();
      let courses_meta:IAcademicCourseMeta[]=[];

      const courseIds=courses?.map((course)=>course._id);

      if(courseIds.length>0){
        courses_meta = await coursesMetaModel.find({courseId:{$in:courseIds}}).lean<IAcademicCourseMeta[]>();
      }

      const { status, resBody } = ApiResponse.success(
        { courses, courses_meta },
        CourseMessage.CourseListed,
      );

      return res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async getASchoolAcademicCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType = await this._courseService.getAnAcademicCourse(
        req,
        res,
      );

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async editASchoolAcademicCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._courseService.updateAcademicCourse(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async deleteASchoolAcademicSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody } = await this._courseService.deleteAnAcademicCourse(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }
}
