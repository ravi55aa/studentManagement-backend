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

// Page level dependencies
export interface IFullCourses {
  courses: IAcademicCourse | null | IAcademicCourse[] | IAcademicCourseMeta[];
  courses_meta: IAcademicCourseMeta | null | IAcademicCourseMeta[] | IAcademicCourse[];
}

//** SCHOOL ACADEMIC YEAR */
@injectable()
export class SchoolYear implements ISchoolAcademicYear {
  constructor(
    @inject(AcademicYearRepository)
    private yearRepo: AcademicYearRepository,
  ) {}

  async addNewSchoolYear(req: Request, res: Response): Promise<serviceReturnType> {
    const dtoData = SchoolAcademicYearDto.addNewYear(req, res);

    handleValidationOF(schoolAcademicYearSchema, dtoData, res);

    const data: Partial<IAcademicYear> = { ...dtoData };
    const newAYearDoc = await this.yearRepo.addAcademicYear(data);

    const { status, resBody } = AcademicYearResponseBody.newAcademicYear(newAYearDoc);

    return { status, resBody };
  }

  async listAllAcademicYears(): Promise<serviceReturnType> {
    const arrOfDoc = await this.yearRepo.getAllAcademicYear();

    const { status, resBody } = AcademicYearResponseBody.listAll<IAcademicYear>(arrOfDoc);

    return { status, resBody };
  }

  async getAAcademicYear(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;

    const doc: Partial<IAcademicYear | null> = await this.yearRepo.findById(id!);

    const { status, resBody } = AcademicYearResponseBody.newAcademicModule<
      Partial<IAcademicYear | null>
    >(
      doc,
      'Cant get academicYear',
      'AcademicYear fetched successfully',
      'Year not found',
      StatusCodes.CREATED,
    );

    return { status, resBody };
  }

  async updateAcademicYear(req: Request, res: Response): Promise<serviceReturnType> {
    const { id } = req.params;

    if (!id) {
      throw new Error('id is invalid, 404');
    }

    const dto = SchoolAcademicYearDto.updateAcademicYear(req, res);

    const doc = await this.yearRepo.updateYear({ _id: id }, dto);

    const { status, resBody } = AcademicYearResponseBody.newAcademicModule<
      Partial<IAcademicYear | null>
    >(
      doc,
      'Cant update academicYear',
      'AcademicYear updated successfully',
      'Year not found',
      StatusCodes.CREATED,
    );

    return { status, resBody };
  }

  async deleteAcademicYear(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;

    const doc = await academicYearModel.deleteOne({ _id: id });

    const { status, resBody } = AcademicYearResponseBody.newAcademicModule(
      doc,
      'Cant get academicYear',
      'AcademicYear fetched successfully',
      'Year not found',
      StatusCodes.CREATED,
    );

    return { status, resBody };
  }
}

//** SCHOOL ACADEMIC SUBJECT */

@injectable()
export class SchoolAcademicSubjectSer implements ISchoolAcademicSubjectSer {
  constructor(
    @inject(AcademicSubjectRepository)
    private repo: ISchoolSubjectsRepo,

    @inject(BatchRepository)
    private batchRepo: IBatchRepository,
  ) {}

  async addAcademicSubject(req: Request, res: Response): Promise<serviceReturnType> {
    const dtoData = await SchoolSubjectsDto.addNewSubject(req, res);

    handleValidationOF(schoolSubjectSchema, dtoData, res);

    const newDoc = await this.repo.addSubject(dtoData);

    const { status, resBody } = AcademicYearResponseBody.newAcademicModule<IAcademicSubject>(
      newDoc,
      'Cant add new Subject',
      'Added new Subject successfully',
      'Cant add New Subject',
      201,
    );

    return { status, resBody };
  }

  async listAllAcademicSubjects(req: Request, res: Response): Promise<serviceReturnType> {
    const { tenantId, adminId } = SchoolAcademicYearDto.getTenantId(req, res);

    const arrOfDoc = await this.repo.getAllSubjects({ tenantId: tenantId, adminId: adminId });

    const { status, resBody } = AcademicYearResponseBody.listAll<IAcademicSubject>(arrOfDoc);

    return { status, resBody };
  }

  async getAnAcademicSubject(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;
    const doc: Partial<IAcademicSubject | null> = await this.repo.findById(id!);

    const { status, resBody } = AcademicYearResponseBody.newAcademicModule<
      Partial<IAcademicSubject | null>
    >(doc, 'Cant get academic subject', 'Subject Fetched successfully', 'Subject not found', 200);

    return { status, resBody };
  }

  async updateAnAcademicSubject(req: Request, res: Response): Promise<serviceReturnType> {
    const dto = await SchoolSubjectsDto.updateSubject(req, res);
    const { id } = req.params;

    //validation
    const doc = await this.repo.updateSubject({ _id: id }, dto);

    const { status, resBody } = AcademicYearResponseBody.newAcademicModule<
      Partial<IAcademicSubject | null>
    >(
      doc,
      'Cant update subject',
      'Subject Updated successfully',
      'Subject not found',
      StatusCodes.CREATED,
    );
    return { status, resBody };
  }

  async deleteAnAcademicSubject(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;

    const doc = await academicSubjectsModel.deleteOne({ _id: id });

    const { status, resBody } = AcademicYearResponseBody.newAcademicModule(
      doc,
      'Cant Delete subject',
      'Subject Deleted successfully',
      'Subject not found',
      StatusCodes.CREATED,
    );
    return { status, resBody };
  }
}

/**
 *
 */
//** SCHOOL ACADEMIC COURSE */
//!validation is pending;

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
    const { courseDto, courseMetaDto } = SchoolCoursesDto.addNewCourse(req, res);

    const allowedBatchesToAttendCourse: Types.ObjectId[] = [];
    const allowedSubjects: Types.ObjectId[] = [];

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
    for (const batch of courseMetaDto.batches) {
      const isBatch = await this.batchRepo.findOne({ code: batch });

      if (isBatch) {
        allowedBatchesToAttendCourse.push(isBatch?._id);
      }
    }

    //Subject of course  ?optional
    if (courseMetaDto.subjects.subjectType == 'ACADEMIC') {
      for (const subjectCode of courseMetaDto.subjects.subjectRef) {
        const isSub = await this.subjectRepo.findOne({ code: subjectCode });

        if (isSub) {
          allowedSubjects.push(isSub._id);
        }
      }
      courseMetaDto.subjects.customSubjectName = [];

      courseMetaDto.subjects.subjectRef = allowedSubjects;
    } else {
      courseMetaDto.subjects.subjectRef = null;
    }

    const academicYearIdDto = await academicYearModel.findOne({ code: courseDto.academicYear });
    courseDto.academicYear = academicYearIdDto;

    //after teacher adding
    //add above same,logic for coordinators;

    courseMetaDto.batches = allowedBatchesToAttendCourse;

    const newCourseDoc = await this.courseRepo.addNewCourse('AcademicCourse', courseDto);

    if (newCourseDoc) {
      await this.courseRepo.addNewCourse('AcademicCourseMeta', {
        ...courseMetaDto,
        courseId: newCourseDoc?._id,
      });
    }

    //validation

    const { status, resBody } = AcademicYearResponseBody.newAcademicModule<
      IAcademicCourse | null | IAcademicCourseMeta
    >(newCourseDoc, 'error', 'messageTrue', 'messageFalse', 200);

    return { status, resBody };
  }

  async listAllAcademicCourses(req: Request, res: Response): Promise<serviceReturnType> {
    const { tenantId, adminId } = SchoolAcademicYearDto.getTenantId(req, res);

    const query = { tenantId: tenantId, adminId: adminId };

    const docCourses = await this.courseRepo.getAllCourses<IAcademicCourse>(
      'AcademicCourse',
      query,
    );
    const docCourses_meta = await this.courseRepo.getAllCourses<IAcademicCourseMeta>(
      'AcademicCourseMeta',
      query,
    );

    const fullCourses: IFullCourses[] = [{ courses: docCourses, courses_meta: docCourses_meta }];

    const { status, resBody } = AcademicYearResponseBody.listAll<IFullCourses>(fullCourses);

    return { status, resBody };
  }

  async getAnAcademicCourse(req: Request, res: Response): Promise<serviceReturnType> {
    const { id } = req.params;
    const { tenantId, adminId } = SchoolAcademicYearDto.getTenantId(req, res);

    const docOfCourse: IAcademicCourse | null = await this.courseRepo.findOneFromCourse({
      _id: id,
      tenantId: tenantId,
      adminId: adminId,
    });

    const docOfCourse_meta: IAcademicCourseMeta | null =
      await this.courseRepo.findOneFromCourseMeta({ courseId: id });

    //handleResBody
    const fullCourses: IFullCourses[] = [{ courses: docOfCourse, courses_meta: docOfCourse_meta }];

    const { status, resBody } = AcademicYearResponseBody.listAll<IFullCourses>(fullCourses);

    return { status, resBody };
  }

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
    if (courseMetaDto?.batches) {
      for (const batch of courseMetaDto.batches) {
        const isBatch = await this.batchRepo.findOne({ code: batch });

        if (isBatch) {
          allowedBatchesToAttendCourse.push(isBatch?._id);
        }
      }
    }

    if (courseMetaDto?.subjects) {
      for (const subject of courseMetaDto.subjects) {
        if (subject.subjectType === 'ACADEMIC') {
          const subjectIds: Types.ObjectId[] = [];

          for (const code of subject.subjectRef ?? []) {
            const isSub = await this.subjectRepo.findOne({ code });
            if (isSub) subjectIds.push(isSub._id);
          }

          subject.subjectRef = subjectIds;
          subject.customSubjectName = [];
        } else {
          subject.subjectRef = null;
        }
      }
    }

    const docOfAcademicYear = await academicYearModel.findOne({ code: courseDto.academicYear });

    if (courseDto.academicYear && docOfAcademicYear) {
      courseDto.academicYear = docOfAcademicYear._id;
    }

    /** 
            after teacher adding
            add above same,logic for coordinators; 
        */

    courseMetaDto.batches = allowedBatchesToAttendCourse;
    // if(courseMetaDto.subjects ){
    //     courseMetaDto.subjects.subjectRef=allowedSubjects;
    // }

    const docUpdatedCourse = await this.courseRepo.updateCourse('AcademicCourse', query, courseDto);

    await this.courseRepo.updateCourse(
      'AcademicCourseMeta',
      { courseId: id },
      { ...courseMetaDto },
    );

    const { status, resBody } = AcademicYearResponseBody.newAcademicModule<
      IAcademicCourse | null | IAcademicCourseMeta
    >(docUpdatedCourse, 'error', 'messageTrue', 'messageFalse', 200);

    return { status, resBody };
  }

  async deleteAnAcademicCourse(req: Request, res: Response): Promise<serviceReturnType> {
    const { id } = req.params;
    const { tenantId, adminId } = SchoolAcademicYearDto.getTenantId(req, res);

    const query = { tenantId, adminId };

    /*
        I need to add an extension here
        i.e if i delete the course successfully,
        Then only can delete courseMeta 
        */
    const docCourse: IAcademicCourse | null = await this.courseRepo.deleteCourse<IAcademicCourse>(
      'AcademicCourse',
      { _id: id, ...query },
    );
    await this.courseRepo.deleteCourse<IAcademicCourseMeta>('AcademicCourseMeta', {
      courseId: id,
      ...query,
    });

    const { status, resBody } =
      AcademicYearResponseBody.handleDeleteOneResBody<IAcademicCourse>(docCourse);

    return { status, resBody };
  }
}
