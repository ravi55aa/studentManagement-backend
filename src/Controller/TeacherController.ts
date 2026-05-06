import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { TYPES } from '@DI/types';
import { ITeacherService } from '@Interfaces/services/ITeacherService';
import { ApiResponse } from '@Constants/apiResponse';
import { TeacherMessage } from '@Constants/resposeMessages';
import { SchoolAcademicYearDto } from '@dto/schoolDTO';

import { TPaginationQuery } from '../types/pagination';

@injectable()
export default class TeacherController {
  constructor(
    @inject(TYPES.TeacherService)
    private _teacherService: ITeacherService,
  ) {}

  public async createTeacherBio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, resBody } = await this._teacherService.createTeacherBio(req, res);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  public async createTeacher(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, resBody } = await this._teacherService.createTeacher(req, res);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  public async updateTeacherBio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        const { status, resBody } = ApiResponse.notFound(TeacherMessage.InvalidTeacherId);
        res.status(status).json(resBody);
      }

      const { status, resBody } = await this._teacherService.updateTeacherBio(id!, req);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  public async updateTeacherProfessional(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { teacherId } = req.params;

      if (!teacherId) {
        const { status, resBody } = ApiResponse.notFound(TeacherMessage.InvalidTeacherId);
        res.status(status).json(resBody);
        return;
      }

      const { status, resBody } = await this._teacherService.updateTeacher(req, res);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  public async getAllTeachers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as TPaginationQuery;

      const decoded=SchoolAcademicYearDto.getTenantId(req,res);

      const { status, resBody } = await this._teacherService.getAllTeachers(query,{tenantId:decoded.tenantId});

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  public async getAllUnAssignedTeachers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { center } = req.query;
      const { limit, page } = req.query as unknown as TPaginationQuery;

      const { status, resBody } = await this._teacherService.getUnassignedTeachers(
        { center: center },
        { limit, page },
      );

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  public async getTeacherById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await this._teacherService.getTeacherById(id!);

      return res.status(result.status).json(result.resBody);
    } catch (err) {
      next(err);
    }
  }

  public async assignClassToTeacher(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { status, resBody } = await this._teacherService.assignClassToTeacher(req);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  public async verifyTeacher(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.params;
      const { status, resBody } = await this._teacherService.verifyTeacherWithEmail(email!);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  // public async updateTeacher(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  // ): Promise<void> {
  //     try {
  //     const { status, resBody } =
  //         await this.teacherService.updateTeacher(req);

  //     res.status(status).json(resBody);
  //     } catch (error) {
  //     next(error);
  //     }
  // }

  // public async deleteTeacher(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  // ): Promise<void> {
  //     try {
  //     const { status, resBody } =
  //         await this.teacherService.deleteTeacher(req);

  //     res.status(status).json(resBody);
  //     } catch (error) {
  //     next(error);
  //     }
  // }
}
