import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';

import { ISchool } from '../Models/schoolModel';
import { handleTokenVerification } from '../Utils/jwt';
import { IAcademicCourse, IAcademicCourseMeta } from '../Models/courses.model';
import { academicYearModel, IAcademicSubject, IAcademicYear } from '../Models/academicYear';
import { IDocument, IUploadedDoc } from '../Models/documentModel';

export class SchoolDTO {
  static createSchool(reqBody: Partial<ISchool>): Partial<ISchool> {
    const { adminName, schoolName, email, password, profile, phone } = reqBody;

    return {
      adminName,
      schoolName,
      email,
      password,
      profile,
      phone,
    };
  }

  static getSchool(req: Request, res: Response): FilterQuery<Partial<ISchool>> {
    const { schoolName, password } = req.query;
    const decoded = handleTokenVerification(req, res);

    const query = {
      schoolName: schoolName,
      password: password,
      userId: decoded.userId,
    };

    return query;
  }

  static updateSchool(req: Request, res: Response): { id: string; dtoData: Partial<ISchool> } {
    const { id } = req.params;

    if (!id) {
      throw new Error('School Id is not found');
    }

    const { adminName, schoolName, phone } = req.body;
    let { profile } = req.body;

    if (req.file) {
      profile = req.file.path;
    }

    handleTokenVerification(req, res);

    const dtoData: Partial<ISchool> = {};

    if (adminName !== undefined) dtoData.adminName = adminName;

    if (schoolName !== undefined) dtoData.schoolName = schoolName;

    if (profile !== undefined) dtoData.profile = profile;

    if (phone !== undefined) dtoData.phone = phone;

    return { id, dtoData };
  }
}

/**
 * Shool Academic Year
 */
export class SchoolAcademicYearDto {
  static addNewYear(req: Request, res: Response) {
    const { code, startDate, endDate, year, status } = req.body;

    const decoded = handleTokenVerification(req, res);
    const dtoData = {
      code: 'YEAR-' + code,
      startDate,
      endDate,
      year,
      status,
      adminId: decoded.userId,
      tenantId: decoded.tenantId,
    };

    return dtoData;
  }

  static getTenantId(req: Request, res: Response) {
    const decoded = handleTokenVerification(req, res);

    const dtoData = {
      adminId: decoded.userId,
      tenantId: decoded.tenantId,
      role: decoded.role,
    };

    return dtoData;
  }

  static updateAcademicYear(req: Request, res: Response) {
    const { code, startDate, endDate, status, year } = req.body;

    const decoded = handleTokenVerification(req, res);

    const updateYearDto = {
      ...(code !== undefined && { code: code.slice(0, 5) == 'YEAR-' ? code : 'YEAR-' + code }),
      ...(startDate !== undefined && { startDate }),
      ...(year !== undefined && { year }),
      ...(endDate !== undefined && { endDate }),
      ...(status !== undefined && { status }),

      adminId: decoded.userId,
      tenantId: decoded.tenantId,
    };

    return updateYearDto;
  }
}

/**
 * School Subjects dto
 */

export class SchoolSubjectsDto {
  static async addNewSubject(req: Request, res: Response) {
    const {
      code,
      name,
      className,
      level,
      type,
      status,
      startDate,
      endDate,
      academicYear,
      department,
      // batchesToFollow,
      maxMarks,
      passMarks,
      credits,
      referenceBooks,
      description,
      modelType,
    } = req.body;

    const decoded = handleTokenVerification(req, res);

    const dtoData = {
      code: 'SUB-' + code,
      name,
      className,
      level,
      type,
      status,
      maxMarks,
      passMarks,
      credits,
      referenceBooks,
      description,
      startDate,
      endDate,
      academicYear,
      department,
      modelType,
      // batchesToFollow: batchesToFollow.split(','),
      adminId: decoded.userId,
      tenantId: decoded.tenantId,
    };

    /**
     * batchesToFollow=batchCodes[];
     */

    // const batchesToFollowArray = [];
    // for (const code of batchesToFollow.split(',')) {
    //   const isBatch = await batchModel.findOne({ code: code });
    //   if (!isBatch) continue;

    //   batchesToFollowArray.push(isBatch._id);
    // }
    // dtoData.batchesToFollow = batchesToFollowArray;

    //AcademicYear
    const findYear = await academicYearModel
      .findOne({ code: dtoData.academicYear })
      .lean<IAcademicYear>();

    if (!findYear) return (dtoData.academicYear = null);

    dtoData.academicYear = findYear._id;

    return dtoData;
  }

  static async updateSubject(req: Request, res: Response) {
    const {
      code,
      name,
      className,
      level,
      type,
      status,
      startDate,
      endDate,
      academicYear,
      department,
      // batchesToFollow,
      maxMarks,
      passMarks,
      credits,
      referenceBooks,
      description,
    } = req.body;

    const decoded = handleTokenVerification(req, res);

    const updateSubjectDto: IAcademicSubject = {
      ...(code && { code: code.slice(0, 4) == 'SUB-' ? code : 'SUB-' + code }),
      ...(name && { name }),
      ...(className && { className }),
      ...(level && { level }),
      ...(type && { type }),
      ...(status && { status }),

      ...(startDate && { startDate }),
      ...(endDate && { endDate }),

      ...(academicYear && { academicYear }),
      ...(department && { department }),

      // ...(batchesToFollow && { batchesToFollow }),

      ...(maxMarks !== undefined && { maxMarks }),
      ...(passMarks !== undefined && { passMarks }),
      ...(credits !== undefined && { credits }),

      ...(Array.isArray(referenceBooks) && { referenceBooks }),
      ...(description && { description }),

      adminId: decoded.userId,
      tenantId: decoded.tenantId,
    };

    // const batchesToFollowArray = [];
    // for (const batchCode of batchesToFollow.split(',')) {
    //   const isBatch = await batchModel.findOne({ code: batchCode });
    //   if (!isBatch) continue;

    //   batchesToFollowArray.push(isBatch._id);
    // }
    // updateSubjectDto.batchesToFollow = batchesToFollowArray;

    return updateSubjectDto;
  }
}

/**
 * School.Course
 */
export class SchoolCoursesDto {
  static addNewCourse(req: Request, res: Response) {
    const {
      code,
      name,
      status,
      schedule,
      academicYear,
      classes,
      duration,
      description,
      maxStudents,
      enrollmentOpen,
      coordinators,
      modelType,
      center,
      eligibilityCriteria,
    } = req.body;

    let { subjects } = req.body;

    const decoded = handleTokenVerification(req, res);
    const courseScheduleDates = {
      endDate: schedule.endDate,
      startDate: schedule.startDate,
    };
    const courseDurations = {
      value: duration.value,
      unit: duration.unit,
    };

    const courseDto = {
      code: 'COU-' + code,
      name,
      status,
      modelType,
      center: modelType == 'School' ? decoded.tenantId : center,
      description,
      academicYear,
      schedule: courseScheduleDates,
      duration: courseDurations,
      adminId: decoded.userId,
      tenantId: decoded.tenantId,
    };

    let arrayOfAttachMents: IUploadedDoc[] = [];
    if (Array.isArray(req.files)) {
      arrayOfAttachMents = req?.files?.map((ele) => {
        return {
          fileName: ele.originalname || 'SomeOne',
          url: ele.path,
        };
      });
    }

    const s_subjects = subjects;
    subjects = {
      subjectType: s_subjects[0] == 'other' ? 'CUSTOM' : 'ACADEMIC',
      subjectRef: s_subjects,
      customSubjectName: s_subjects,
    };

    const courseMetaDto = {
      classes,
      attachments: arrayOfAttachMents,
      maxStudents,
      enrollmentOpen,
      subjects,
      coordinators,
      eligibilityCriteria,
    };

    return { courseDto, courseMetaDto };
  }

  static updateCourse(req: Request, res: Response) {
    const {
      code,
      name,
      //level,
      status,
      schedule,
      academicYear,
      classes,
      duration,
      description,
      maxStudents,
      enrollmentOpen,
      coordinators,
      eligibilityCriteria,
      modelType,
      center,
    } = req.body;

    let { subjects } = req.body;

    const decoded = handleTokenVerification(req, res);

    const courseDto: Partial<IAcademicCourse> = {
      ...(code && { code: code.slice(0, 4) == 'COU-' ? code : 'COU-' + code }),
      ...(name && { name }),
      //...(level && { level }),
      ...(status && { status }),
      ...(description && { description }),
      ...(academicYear && { academicYear }),
      ...(modelType && { modelType }),
      ...(center && { center: modelType == 'School' ? decoded.tenantId : center }),

      ...(schedule && {
        schedule: {
          ...(schedule.startDate && { startDate: schedule.startDate }),
          ...(schedule.endDate && { endDate: schedule.endDate }),
        },
      }),

      ...(duration && {
        duration: {
          ...(duration.value && { value: duration.value }),
          ...(duration.unit && { unit: duration.unit }),
        },
      }),

      adminId: decoded.userId,
      tenantId: decoded.tenantId,
    };

    let arrayOfAttachMents: IUploadedDoc[] = [];

    if (Array.isArray(req.files)) {
      arrayOfAttachMents = req.files.map((ele) => ({
        fileName: ele.originalname || 'SomeOne',
        url: ele.path,
      }));
    }

    const s_subjects = [...subjects];
    subjects = [
      {
        subjectType: s_subjects[0] == 'other' ? 'CUSTOM' : 'ACADEMIC',
        subjectRef: s_subjects,
        customSubjectName: s_subjects,
      },
    ];

    const courseMetaDto: Partial<IAcademicCourseMeta> = {
      ...(classes && { classes }),
      ...(arrayOfAttachMents.length && { attachments: arrayOfAttachMents }),
      ...(maxStudents !== undefined && { maxStudents }),
      ...(enrollmentOpen !== undefined && { enrollmentOpen }),
      ...(subjects && { subjects }),
      ...(coordinators && { coordinators }),
      ...(eligibilityCriteria && { eligibilityCriteria }),
    };

    return { courseDto, courseMetaDto };
  }
}

/**
 * Documents
 */
export class DocumentsDto {
  static handleDtoOfDoc(req: Request, res: Response): Partial<IDocument> {
    const files = req.files as Express.Multer.File[];
    const docs = files?.map((f) => ({
      url: f.path,
      fileName: f.filename,
    }));

    const { adminId, tenantId, role } = SchoolAcademicYearDto.getTenantId(req, res);

    return {
      userId: role == 'School' ? tenantId : adminId,
      tenantId: tenantId,
      role: role || 'School',
      docs,
    };
  }

  static updateDoc(req: Request, res: Response) {
    const decoded = handleTokenVerification(req, res);

    const { docs } = this.handleDtoOfDoc(req, res);
    if (!docs || docs?.length <= 0) {
      throw new Error('Nothing in the docs');
    }

    const role = req.headers.role;

    const dtoData: IUploadedDoc[] = docs;

    const dtoQuery: FilterQuery<Partial<IDocument>> = { role: role, userId: decoded.userId };

    return { dtoData, dtoQuery };
  }

  static updateDocV2(req: Request, res: Response) {
    const { userId } = req.params;

    const { docs } = this.handleDtoOfDoc(req, res);
    
    if (!docs || docs?.length <= 0) {
      throw new Error('Nothing in the docs');
    }

    const role = req.headers.role;

    const dtoData: IUploadedDoc[] = docs;

    const dtoQuery: FilterQuery<Partial<IDocument>> = { role: role, userId: userId };

    return { dtoData, dtoQuery };
  }

  static deleteDoc(req: Request, res: Response) {
    // All kinds of documents removed here

    const { userId } = req.params;
    const { file_Name } = req.query;

    handleTokenVerification(req, res);

    const role = req.headers.role;

    const dtoQuery: FilterQuery<Partial<IDocument>> = {
      role: role,
      userId: userId,
      'docs.fileName': file_Name,
    };

    return dtoQuery;
  }

  static removeOneDocument = (req: Request) => {
    /**
     * Destructure properties
     * HandleTokenVerification
     * Structure query
     * Return Structured_query
     */

    const { userId } = req.params;
    const { file_Name } = req.query;

    //handleTokenVerification(req,res);

    const filterQuery: FilterQuery<Partial<IDocument>> = {userId };

    const pullQuery: FilterQuery<Partial<IDocument>> = { docs: { fileName: file_Name } };

    return { filterQuery: filterQuery, pullQuery: pullQuery };
  };
}
