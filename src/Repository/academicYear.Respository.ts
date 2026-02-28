import { FilterQuery } from 'mongoose';
import { injectable } from 'tsyringe';

import {
  ISchoolAcademicYearRepo,
  ISchoolCoursesRepo,
  ISchoolSubjectsRepo,
} from '../Interfaces/repository/ISchoolAcademiYear';
import academicSubjectsModel, {
  academicYearModel,
  IAcademicSubject,
  IAcademicYear,
} from '../Models/academicYear';
import coursesModel, {
  coursesMetaModel,
  IAcademicCourse,
  IAcademicCourseMeta,
} from '../Models/courses.model';
import logger from '../Utils/logger';

import { BaseRepository } from './BaseRepository';

/**
 *
 * ACADEMIC-YEAR
 */
@injectable()
export class AcademicYearRepository
  extends BaseRepository<IAcademicYear>
  implements ISchoolAcademicYearRepo
{
  constructor() {
    super(academicYearModel);
  }

  /* =========CREATE YEAR============ */
  async addAcademicYear(data: Partial<IAcademicYear>): Promise<IAcademicYear | null> {
    try {
      return await this.create(data);
    } catch (error) {
      logger.error('AddAcademicYear failed', {
        layer: 'repository',
        module: 'academicYear',
        error,
      });
      return null;
    }
  }

  /* ===========GET ALL YEARS============== */
  async getAllAcademicYear(): Promise<IAcademicYear[]> {
    try {
      return await this.model.find().lean<IAcademicYear[]>();
    } catch (error) {
      logger.error('GetAllAcademicYear failed', {
        layer: 'repository',
        module: 'academicYear',
        error,
      });
      return [];
    }
  }

  /* ==========UPDATE YEAR=============*/
  async updateYear(
    query: FilterQuery<Partial<IAcademicYear>>,
    data: Partial<IAcademicYear>,
  ): Promise<IAcademicYear | null> {
    try {
      if (!query || Object.keys(query).length === 0) {
        return null;
      }

      return await this.model
        .findOneAndUpdate(
          query,
          { $set: data },
          {
            new: true,
            runValidators: true,
          },
        )
        .lean<IAcademicYear>();
    } catch (error) {
      logger.error('UpdateYear failed', {
        layer: 'repository',
        module: 'academicYear',
        error,
      });
      return null;
    }
  }

  /* ===========DELETE YEAR==============*/
  async deleteYear(id: string): Promise<boolean> {
    try {
      if (!id) return false;

      const result = await this.model.deleteOne({
        _id: id,
      });

      return result.deletedCount === 1;
    } catch (error) {
      logger.error('DeleteYear failed', {
        layer: 'repository',
        module: 'academicYear',
        error,
      });
      return false;
    }
  }
}

/**
 *
 * ACADEMIC-SUBJECT
 */
@injectable()
export class AcademicSubjectRepository
  extends BaseRepository<IAcademicSubject>
  implements ISchoolSubjectsRepo
{
  constructor() {
    super(academicSubjectsModel);
  }

  /* ==============CREATE SUBJECT============= */
  async addSubject(payload: Partial<IAcademicSubject>): Promise<IAcademicSubject | null> {
    try {
      return await this.create(payload);
    } catch (error) {
      logger.error('AddSubject failed', {
        layer: 'repository',
        module: 'academicSubject',
        error,
      });
      return null;
    }
  }

  /* ==========GET ALL SUBJECTS (WITH FILTER)=========== */
  async getAllSubjects(
    query: FilterQuery<Partial<IAcademicSubject>> = {},
  ): Promise<IAcademicSubject[]> {
    try {
      return await this.model.find(query).sort({ createdAt: -1 }).lean<IAcademicSubject[]>();
    } catch (error) {
      logger.error('GetAllSubjects failed', {
        layer: 'repository',
        module: 'academicSubject',
        error,
      });
      return [];
    }
  }

  /* ==============UPDATE SUBJECT============= */
  async updateSubject(
    query: FilterQuery<Partial<IAcademicSubject>>,
    data: Partial<IAcademicSubject>,
  ): Promise<IAcademicSubject | null> {
    try {
      if (!query || Object.keys(query).length === 0) {
        return null;
      }

      return await this.model
        .findOneAndUpdate(
          query,
          { $set: data },
          {
            new: true,
            runValidators: true,
          },
        )
        .lean<IAcademicSubject>();
    } catch (error) {
      logger.error('UpdateSubject failed', {
        layer: 'repository',
        module: 'academicSubject',
        error,
      });
      return null;
    }
  }

  /* ===============DELETE SUBJECT===============*/
  async deleteSubject(id: string): Promise<boolean> {
    try {
      if (!id) return false;

      const result = await this.model.deleteOne({ _id: id });

      return result.deletedCount === 1;
    } catch (error) {
      logger.error('DeleteSubject failed', {
        layer: 'repository',
        module: 'academicSubject',
        error,
      });
      return false;
    }
  }
}

/**
 *
 * ACADEMIC-COURSE
 */
@injectable()
export class AcademicCourseRepository
  extends BaseRepository<IAcademicCourse>
  implements ISchoolCoursesRepo
{
  constructor() {
    super(coursesModel);
  }

  /* ==============CREATE COURSE=============== */
  async createCourse(payload: Partial<IAcademicCourse>): Promise<IAcademicCourse | null> {
    try {
      return await this.model.create(payload);
    } catch (error) {
      logger.error('CreateCourse failed', {
        layer: 'repository',
        module: 'academicCourse',
        error,
      });
      return null;
    }
  }

  /* ==============CREATE COURSE META=============== */
  async createCourseMeta(
    payload: Partial<IAcademicCourseMeta>,
  ): Promise<IAcademicCourseMeta | null> {
    try {
      return await coursesMetaModel.create(payload);
    } catch (error) {
      logger.error('CreateCourseMeta failed', {
        layer: 'repository',
        module: 'academicCourse',
        error,
      });
      return null;
    }
  }

  /* ==============GET ALL COURSES=============== */
  async getAllCourses(query: FilterQuery<Partial<IAcademicCourse>>): Promise<IAcademicCourse[]> {
    try {
      return await this.model.find(query).lean<IAcademicCourse[]>();
    } catch (error) {
      logger.error('GetAllCourses failed', {
        layer: 'repository',
        module: 'academicCourse',
        error,
      });
      return [];
    }
  }

  /* ==============GET ALL META=============== */
  async getAllCourseMeta(
    query: FilterQuery<Partial<IAcademicCourseMeta>>,
  ): Promise<IAcademicCourseMeta[]> {
    try {
      return await coursesMetaModel.find(query).lean<IAcademicCourseMeta[]>();
    } catch (error) {
      logger.error('GetAllCourseMeta failed', {
        layer: 'repository',
        module: 'academicCourse',
        error,
      });
      return [];
    }
  }

  /* ==============FIND ONE COURSE=============== */
  async findOneCourse(
    query: FilterQuery<Partial<IAcademicCourse>>,
  ): Promise<IAcademicCourse | null> {
    try {
      return await this.model.findOne(query).populate('academicYear').lean<IAcademicCourse>();
    } catch (error) {
      logger.error('FindOneCourse failed', {
        layer: 'repository',
        module: 'academicCourse',
        error,
      });
      return null;
    }
  }

  /* ==============FIND ONE META=============== */
  async findOneCourseMeta(
    query: FilterQuery<Partial<IAcademicCourseMeta>>,
  ): Promise<IAcademicCourseMeta | null> {
    try {
      return await coursesMetaModel.findOne(query).lean<IAcademicCourseMeta>();
    } catch (error) {
      logger.error('FindOneCourseMeta failed', {
        layer: 'repository',
        module: 'academicCourse',
        error,
      });
      return null;
    }
  }

  /* ==============UPDATE COURSE=============== */
  async updateCourse(
    query: FilterQuery<Partial<IAcademicCourse>>,
    data: Partial<IAcademicCourse>,
  ): Promise<IAcademicCourse | null> {
    try {
      return await this.model
        .findOneAndUpdate(query, { $set: data }, { new: true, runValidators: true })
        .lean<IAcademicCourse>();
    } catch (error) {
      logger.error('UpdateCourse failed', {
        layer: 'repository',
        module: 'academicCourse',
        error,
      });
      return null;
    }
  }

  /* ==============UPDATE META=============== */
  async updateCourseMeta(
    query: FilterQuery<Partial<IAcademicCourseMeta>>,
    data: Partial<IAcademicCourseMeta>,
  ): Promise<IAcademicCourseMeta | null> {
    try {
      return await coursesMetaModel
        .findOneAndUpdate(query, { $set: data }, { new: true, runValidators: true })
        .lean<IAcademicCourseMeta>();
    } catch (error) {
      logger.error('UpdateCourseMeta failed', {
        layer: 'repository',
        module: 'academicCourse',
        error,
      });
      return null;
    }
  }

  /* ==============DELETE COURSE=============== */
  async deleteCourse(query: FilterQuery<Partial<IAcademicCourse>>): Promise<boolean> {
    try {
      const result = await this.model.deleteOne(query);
      return result.deletedCount === 1;
    } catch (error) {
      logger.error('DeleteCourse failed', {
        layer: 'repository',
        module: 'academicCourse',
        error,
      });
      return false;
    }
  }

  /* ==============DELETE META=============== */
  async deleteCourseMeta(query: FilterQuery<Partial<IAcademicCourseMeta>>): Promise<boolean> {
    try {
      const result = await coursesMetaModel.deleteOne(query);
      return result.deletedCount === 1;
    } catch (error) {
      logger.error('DeleteCourseMeta failed', {
        layer: 'repository',
        module: 'academicCourse',
        error,
      });
      return false;
    }
  }
}
