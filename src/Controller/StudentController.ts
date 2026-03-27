import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { TYPES } from '@DI/types';
import { IStudentService } from '@Interfaces/services/IStudentService';
import { serviceReturnType } from '@Constants/interfaces';
import { ApiResponse } from '@Constants/apiResponse';
import { StudentMessage } from '@Constants/resposeMessages';

@injectable()
export class StudentsController {
  constructor(
    @inject(TYPES.StudentService)
    private _studentService: IStudentService,
  ) {}

  async addNewStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType = await this._studentService.createStudent(
        req,
        res,
      );

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async getAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, resBody }: serviceReturnType = await this._studentService.getAllStudents({});

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async getAStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { status, resBody }: serviceReturnType = await this._studentService.getStudentById(id!);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  async editStudent(req: Request, res: Response, next: NextFunction) {
      try {
        const {studentId}=req.params;

        if(!studentId){
          const {status,resBody}=ApiResponse.badRequest(StudentMessage.StudentIdNotFound);
          return res.status(status).json(resBody);
        }

      const { status, resBody }: serviceReturnType =
          await this._studentService.updateStudent(req, res);

      res.status(status).json(resBody);

      } catch (err) {
      next(err);
      }
  }

  async deleteStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { status, resBody }: serviceReturnType = await this._studentService.deleteStudent(id!);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }
}
