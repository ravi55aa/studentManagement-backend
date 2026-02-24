import { Types } from 'mongoose';
import { Request, Response } from 'express';
import { StatusCodes } from '../Constants/statusCodes';
import academicSubjectsModel from '../Models/academicYear';
import { serviceReturnType } from '../Constants/interfaces';
import { handleValidationOF } from '../Middlewares/validateUser.middleware';
import { AcademicYearResponseBody } from '../Utils/ResponseBody/academicYear.resonseBody';
import { IBatchRepository } from '../Interfaces/repository/IBatchRepository';

import { IAcademicCourse, IAcademicCourseMeta } from '../Models/courses.model';

import { schoolAcademicYearSchema, schoolSubjectSchema } from '../Validators/school.validator';

import { academicYearModel, IAcademicSubject, IAcademicYear } from '../Models/academicYear';

import { SchoolAcademicYearDto, SchoolCoursesDto, SchoolSubjectsDto } from '../dto/schoolDTO';

import {
  ISchoolCoursesRepo,
  ISchoolSubjectsRepo,
} from '../Interfaces/repository/ISchoolAcademiYear';

import {
  ISchoolAcademicCourseSer,
  ISchoolAcademicSubjectSer,
  ISchoolAcademicYear,
} from '../Interfaces/services/ISchoolAcademicYear';
import {
  AcademicCourseRepository,
  AcademicSubjectRepository,
  AcademicYearRepository,
} from '../Repository/academicYear.Respository';
import { injectable, inject } from 'tsyringe';
import { BatchRepository } from '../Repository/batchRespository';
import {
  AcademicCourseMessage,
  AcademicSubjectMessage,
  AcademicYearMessage,
} from '../Constants/resposeMessages';
import logger from '../Utils/logger';
import { ApiResponse } from '../Constants/apiResponse';

// Page level dependencies
export interface IFullCourses {
  courses: IAcademicCourse | null | IAcademicCourse[] | IAcademicCourseMeta[];
  courses_meta: IAcademicCourseMeta | null | IAcademicCourseMeta[] | IAcademicCourse[];
}

/**
 *
 *
 * SCHOOL ACADEMIC YEAR
 */
@injectable()
export class SchoolYear implements ISchoolAcademicYear {
  constructor(
    @inject(AcademicYearRepository)
    private yearRepo: AcademicYearRepository,
  ) {}

  /* =================ADD NEW ACADEMIC YEAR==================== */
  async addNewSchoolYear(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const dto = SchoolAcademicYearDto.addNewYear(req, res);

      handleValidationOF(schoolAcademicYearSchema, dto, res);

      const created = await this.yearRepo.addAcademicYear(dto);

      if (!created) {
        return ApiResponse.failure(AcademicYearMessage.YearCreateFailed);
      }

      return ApiResponse.success(created, AcademicYearMessage.YearCreated);
    } catch (error) {
      logger.error('AddNewSchoolYear failed', {
        layer: 'service',
        module: 'academicYear',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* =================LIST ALL YEARS==================== */
  async listAllAcademicYears(): Promise<serviceReturnType> {
    try {
      const years = await this.yearRepo.getAllAcademicYear();

      if (!years || years.length === 0) {
        return ApiResponse.notFound(AcademicYearMessage.NoYearsFound);
      }

      return ApiResponse.success(years, AcademicYearMessage.YearsListed);
    } catch (error) {
      logger.error('ListAllAcademicYears failed', {
        layer: 'service',
        module: 'academicYear',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* =================GET SINGLE YEAR==================== */
  async getAAcademicYear(req: Request): Promise<serviceReturnType> {
    try {
      const { id } = req.params;

      if (!id) {
        return ApiResponse.badRequest(AcademicYearMessage.InvalidYearId);
      }

      const year = await this.yearRepo.findById(id);

      if (!year) {
        return ApiResponse.notFound(AcademicYearMessage.YearNotFound);
      }

      return ApiResponse.success(year, AcademicYearMessage.YearFetched);
    } catch (error) {
      logger.error('GetAcademicYear failed', {
        layer: 'service',
        module: 'academicYear',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* =================UPDATE YEAR==================== */
  async updateAcademicYear(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const { id } = req.params;

      if (!id) {
        return ApiResponse.badRequest(AcademicYearMessage.InvalidYearId);
      }

      const dto = SchoolAcademicYearDto.updateAcademicYear(req, res);

      const updated = await this.yearRepo.updateYear({ _id: id }, dto);

      if (!updated) {
        return ApiResponse.notFound(AcademicYearMessage.YearNotFound);
      }

      return ApiResponse.success(updated, AcademicYearMessage.YearUpdated);
    } catch (error) {
      logger.error('UpdateAcademicYear failed', {
        layer: 'service',
        module: 'academicYear',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* =================DELETE YEAR==================== */
  async deleteAcademicYear(req: Request): Promise<serviceReturnType> {
    try {
      const { id } = req.params;

      if (!id) {
        return ApiResponse.badRequest(AcademicYearMessage.InvalidYearId);
      }

      const deleted = await this.yearRepo.deleteYear(id);

      if (!deleted) {
        return ApiResponse.notFound(AcademicYearMessage.YearNotFound);
      }

      return ApiResponse.success(null, AcademicYearMessage.YearDeleted);
    } catch (error) {
      logger.error('DeleteAcademicYear failed', {
        layer: 'service',
        module: 'academicYear',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }
}

/**
 *
 *
 * SCHOOL ACADEMIC SUBJECT
 */
@injectable()
export class SchoolAcademicSubjectSer implements ISchoolAcademicSubjectSer {
  constructor(
    @inject(AcademicSubjectRepository)
    private repo: ISchoolSubjectsRepo,

    @inject(BatchRepository)
    private batchRepo: IBatchRepository,
  ) {}

  /* =============ADD SUBJECT============= */
  async addAcademicSubject(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const dto = await SchoolSubjectsDto.addNewSubject(req, res);

      handleValidationOF(schoolSubjectSchema, dto, res);

      const created = await this.repo.addSubject(dto);

      if (!created) {
        return ApiResponse.failure(AcademicSubjectMessage.SubjectCreateFailed);
      }

      return ApiResponse.success(created, AcademicSubjectMessage.SubjectCreated);
    } catch (error) {
      logger.error('AddAcademicSubject failed', {
        layer: 'service',
        module: 'academicSubject',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* =============LIST ALL SUBJECTS============= */
  async listAllAcademicSubjects(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const { tenantId, adminId } = SchoolAcademicYearDto.getTenantId(req, res);

      const subjects = await this.repo.getAllSubjects({
        tenantId,
        adminId,
      });

      if (!subjects || subjects.length === 0) {
        return ApiResponse.notFound(AcademicSubjectMessage.NoSubjectsFound);
      }

      return ApiResponse.success(subjects, AcademicSubjectMessage.SubjectsListed);
    } catch (error) {
      logger.error('ListAcademicSubjects failed', {
        layer: 'service',
        module: 'academicSubject',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* ============GET SUBJECT BY ID=============== */
  async getAnAcademicSubject(req: Request): Promise<serviceReturnType> {
    try {
      const { id } = req.params;

      if (!id) {
        return ApiResponse.badRequest(AcademicSubjectMessage.InvalidSubjectId);
      }

      const subject = await this.repo.findById(id);

      if (!subject) {
        return ApiResponse.notFound(AcademicSubjectMessage.SubjectNotFound);
      }

      return ApiResponse.success(subject, AcademicSubjectMessage.SubjectFetched);
    } catch (error) {
      logger.error('GetAcademicSubject failed', {
        layer: 'service',
        module: 'academicSubject',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* ===============UPDATE SUBJECT============== */
  async updateAnAcademicSubject(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const { id } = req.params;

      if (!id) {
        return ApiResponse.badRequest(AcademicSubjectMessage.InvalidSubjectId);
      }

      const dto = await SchoolSubjectsDto.updateSubject(req, res);

      const updated = await this.repo.updateSubject({ _id: id }, dto);

      if (!updated) {
        return ApiResponse.notFound(AcademicSubjectMessage.SubjectNotFound);
      }

      return ApiResponse.success(updated, AcademicSubjectMessage.SubjectUpdated);
    } catch (error) {
      logger.error('UpdateAcademicSubject failed', {
        layer: 'service',
        module: 'academicSubject',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* =================DELETE SUBJECT=============== */
  async deleteAnAcademicSubject(req: Request): Promise<serviceReturnType> {
    try {
      const { id } = req.params;

      if (!id) {
        return ApiResponse.badRequest(AcademicSubjectMessage.InvalidSubjectId);
      }

      const deleted = await this.repo.deleteSubject(id);

      if (!deleted) {
        return ApiResponse.notFound(AcademicSubjectMessage.SubjectNotFound);
      }

      return ApiResponse.success(null, AcademicSubjectMessage.SubjectDeleted);
    } catch (error) {
      logger.error('DeleteAcademicSubject failed', {
        layer: 'service',
        module: 'academicSubject',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }
}

/**
 *
 *
 * SCHOOL ACADEMIC COURSE
 */
@injectable()
export class SchoolAcademicCoursesService implements ISchoolAcademicCourseSer {
  constructor(
    @inject(AcademicCourseRepository)
    private courseRepo: ISchoolCoursesRepo,

    @inject(BatchRepository)
    private batchRepo: IBatchRepository,

    @inject(AcademicSubjectRepository)
    private subjectRepo: ISchoolSubjectsRepo,
  ) {}

  async createNewCourse(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const { courseDto, courseMetaDto } = SchoolCoursesDto.addNewCourse(req, res);

      /* ===============Resolve Subjects==================== */
      if (courseMetaDto.subjects && courseMetaDto.subjects.subjectType === 'ACADEMIC') {
        const subjectDocs = await Promise.all(
          (courseMetaDto.subjects.subjectRef ?? []).map((code: string) =>
            this.subjectRepo.findOne({ code }),
          ),
        );

        const validSubjects = subjectDocs.filter(Boolean).map((s) => s!._id);

        if (validSubjects.length === 0) {
          return ApiResponse.badRequest(AcademicCourseMessage.SubjectNotFound);
        }

        courseMetaDto.subjects.subjectRef = validSubjects;
        courseMetaDto.subjects.customSubjectName = [];
      } else if (courseMetaDto.subjects) {
        courseMetaDto.subjects.subjectRef = null;
      }

      /* ==================Resolve Academic Year (Use Repository)================== */
      const academicYear = await academicYearModel.findOne({
        code: courseDto.academicYear,
      });

      if (!academicYear) {
        return ApiResponse.badRequest(AcademicCourseMessage.AcademicYearNotFound);
      }

      courseDto.academicYear = academicYear._id;

      /* ==================Create Course================== */
      const newCourse = await this.courseRepo.createCourse(courseDto);

      if (!newCourse) {
        return ApiResponse.failure(AcademicCourseMessage.CourseCreateFailed);
      }

      /* ==================Create Course Meta================== */
      const newMeta = await this.courseRepo.createCourseMeta({
        ...courseMetaDto,
        courseId: newCourse._id,
      });

      if (!newMeta) {
        return ApiResponse.failure(AcademicCourseMessage.CourseMetaCreateFailed);
      }

      return ApiResponse.success(
        { course: newCourse, meta: newMeta },
        AcademicCourseMessage.CourseCreated,
      );
    } catch (error) {
      logger.error('CreateNewCourse failed', {
        layer: 'service',
        module: 'academicCourse',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* ============LIST ALL COURSES============== */
  async listAllAcademicCourses(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const { tenantId, adminId } = SchoolAcademicYearDto.getTenantId(req, res);

      const query = { tenantId, adminId };

      /* ==========================================
       Fetch Courses
    ========================================== */
      const courses = await this.courseRepo.getAllCourses(query);

      if (!courses || courses.length === 0) {
        return ApiResponse.notFound(AcademicCourseMessage.NoCoursesFound);
      }

      /* ==========================================
       Fetch Meta
    ========================================== */
      const meta = await this.courseRepo.getAllCourseMeta(query);

      return ApiResponse.success({ courses, meta }, AcademicCourseMessage.CoursesListed);
    } catch (error) {
      logger.error('ListAllAcademicCourses failed', {
        layer: 'service',
        module: 'academicCourse',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* =========GET SINGLE COURSE============= */
  async getAnAcademicCourse(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const { id } = req.params;

      if (!id) {
        return ApiResponse.badRequest(AcademicCourseMessage.InvalidCourseId);
      }

      const { tenantId, adminId } = SchoolAcademicYearDto.getTenantId(req, res);

      const query = { _id: id, tenantId, adminId };

      /* ===============Fetch Course==================== */
      const course = await this.courseRepo.findOneCourse(query);

      if (!course) {
        return ApiResponse.notFound(AcademicCourseMessage.CourseNotFound);
      }

      /* ===============Fetch Meta==================== */
      const meta = await this.courseRepo.findOneCourseMeta({
        courseId: id,
        tenantId,
        adminId,
      });

      return ApiResponse.success({ course, meta }, AcademicCourseMessage.CourseFetched);
    } catch (error) {
      logger.error('GetAcademicCourse failed', {
        layer: 'service',
        module: 'academicCourse',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }

  /* ==========UPDATE COURSE=============== */
  async updateAcademicCourse(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const { id } = req.params;

      if (!id) {
        return ApiResponse.badRequest(AcademicCourseMessage.InvalidCourseId);
      }

      const { tenantId, adminId } = SchoolAcademicYearDto.getTenantId(req, res);

      const query = { _id: id, tenantId, adminId };

      const { courseDto, courseMetaDto } = SchoolCoursesDto.updateCourse(req, res);

      /* ===============Resolve Subjects==================== */
      if (courseMetaDto?.subjects) {
        await Promise.all(
          courseMetaDto.subjects.map(async (subject) => {
            if (subject.subjectType === 'ACADEMIC') {
              const subjectDocs = await Promise.all(
                (subject.subjectRef ?? []).map((code) => this.subjectRepo.findOne({ code })),
              );

              subject.subjectRef = subjectDocs.filter(Boolean).map((s) => s!._id);

              subject.customSubjectName = [];
            } else {
              subject.subjectRef = null;
            }
          }),
        );
      }

      /* ===============Resolve Academic Year==================== */
      if (courseDto.academicYear) {
        const academicYear = await academicYearModel.findOne({
          code: courseDto.academicYear,
        });

        if (!academicYear) {
          return ApiResponse.badRequest(AcademicCourseMessage.AcademicYearNotFound);
        }

        courseDto.academicYear = academicYear._id;
      }

      /* ===============Update Course==================== */
      const updatedCourse = await this.courseRepo.updateCourse(query, courseDto);

      if (!updatedCourse) {
        return ApiResponse.notFound(AcademicCourseMessage.CourseNotFound);
      }

      /* ==================Update Course Meta======================= */
      if (courseMetaDto) {
        await this.courseRepo.updateCourseMeta({ courseId: id, tenantId, adminId }, courseMetaDto);
      }

      return ApiResponse.success(updatedCourse, AcademicCourseMessage.CourseUpdated);
    } catch (error) {
      logger.error('UpdateAcademicCourse failed', {
        layer: 'service',
        module: 'academicCourse',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }
  async deleteAnAcademicCourse(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const { id } = req.params;

      if (!id) {
        return ApiResponse.badRequest(AcademicCourseMessage.InvalidCourseId);
      }

      const { tenantId, adminId } = SchoolAcademicYearDto.getTenantId(req, res);

      const query = { _id: id, tenantId, adminId };

      /* ==============Delete Course First=================== */
      const deletedCourse = await this.courseRepo.deleteCourse(query);

      if (!deletedCourse) {
        return ApiResponse.notFound(AcademicCourseMessage.CourseNotFound);
      }

      /* ==========Delete Meta Only If Course Deleted=============== */
      await this.courseRepo.deleteCourseMeta({
        courseId: id,
        tenantId,
        adminId,
      });

      return ApiResponse.success(null, AcademicCourseMessage.CourseDeleted);
    } catch (error) {
      logger.error('DeleteAcademicCourse failed', {
        layer: 'service',
        module: 'academicCourse',
        error,
      });

      return ApiResponse.failure('Internal server error');
    }
  }
}











































/*

 async updateAcademicCourse(req: Request, res: Response): Promise<serviceReturnType> {
    const { id } = req.params;
    const { tenantId, adminId } = SchoolAcademicYearDto.getTenantId(req, res);
    const query = { _id: id, tenantId: tenantId, adminId: adminId };
    const { courseDto, courseMetaDto } = SchoolCoursesDto.updateCourse(req, res);

    const allowedBatchesToAttendCourse: Types.ObjectId[] = [];

    /**LATER UPDATE THE MULTIPLES LOOPS BELOW;
        const findAndPushValidDocs = async <T extends { _id: any }>(
            field: string,
            repo: IBaseRepository<T>,
            arrayOfValues: string[],
            targetArray: any[]
            ): Promise<void> => {

            for (const value of arrayOfValues) {
                const doc = await repo.findOne({ [field]: value });

                if (doc) { targetArray.push(doc._id) };
            }
        };
        findAndPushValidDocs("code","batchRepo",courseMetaDto.batches,allowedBatchesToAttendCourse);
        */

//Baches to follow
// if (courseMetaDto?.batches) {
//   for (const batch of courseMetaDto.batches) {
//     const isBatch = await this.batchRepo.findOne({ code: batch });

//     if (isBatch) {
//       allowedBatchesToAttendCourse.push(isBatch?._id);
//     }
//   }
// }

//   if (courseMetaDto?.subjects) {
//     for (const subject of courseMetaDto.subjects) {
//       if (subject.subjectType === 'ACADEMIC') {
//         const subjectIds: Types.ObjectId[] = [];

//         for (const code of subject.subjectRef ?? []) {
//           const isSub = await this.subjectRepo.findOne({ code });
//           if (isSub) subjectIds.push(isSub._id);
//         }

//         subject.subjectRef = subjectIds;
//         subject.customSubjectName = [];
//       } else {
//         subject.subjectRef = null;
//       }
//     }
//   }

//   const docOfAcademicYear = await academicYearModel.findOne({ code: courseDto.academicYear });

//   if (courseDto.academicYear && docOfAcademicYear) {
//     courseDto.academicYear = docOfAcademicYear._id;
//   }

//   /**
//           after teacher adding
//           add above same,logic for coordinators;
//       */

//   //courseMetaDto.batches = allowedBatchesToAttendCourse;
//   // if(courseMetaDto.subjects ){
//   //     courseMetaDto.subjects.subjectRef=allowedSubjects;
//   // }

//   const docUpdatedCourse = await this.courseRepo.updateCourse('AcademicCourse', query, courseDto);

//   await this.courseRepo.updateCourse(
//     'AcademicCourseMeta',
//     { courseId: id },
//     { ...courseMetaDto },
//   );

//   const { status, resBody } = AcademicYearResponseBody.newAcademicModule<
//     IAcademicCourse | null | IAcademicCourseMeta
//   >(docUpdatedCourse, 'error', 'messageTrue', 'messageFalse', 200);

//   return { status, resBody };
// }

// async listAllAcademicCourses(req: Request, res: Response): Promise<serviceReturnType> {
//   const { tenantId, adminId } = SchoolAcademicYearDto.getTenantId(req, res);

//   const query = { tenantId: tenantId, adminId: adminId };

//   const docCourses = await this.courseRepo.getAllCourses<IAcademicCourse>(
//     'AcademicCourse',
//     query,
//   );
//   const docCourses_meta = await this.courseRepo.getAllCourses<IAcademicCourseMeta>(
//     'AcademicCourseMeta',
//     query,
//   );

//   const fullCourses: IFullCourses[] = [{ courses: docCourses, courses_meta: docCourses_meta }];

//   const { status, resBody } = AcademicYearResponseBody.listAll<IFullCourses>(fullCourses);

//   return { status, resBody };
// }
