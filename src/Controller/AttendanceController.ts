import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { TYPES } from '@DI/types';
import { IStudentAttendanceService } from '@Interfaces/services/IAttendanceService';
import { serviceReturnType } from '@Constants/interfaces';

@injectable()
export class StudentAttendanceController {
    constructor(
        @inject(TYPES.StudentAttendanceService)
        private _attendanceService: IStudentAttendanceService,
    ) {}

    // Mark Attendance
    async markAttendance(req: Request, res: Response, next: NextFunction) {
        try {
        const { status, resBody }: serviceReturnType = await this._attendanceService.markAttendance(
            req,
            res,
        );

        res.status(status).json(resBody);
        } catch (err) {
        next(err);
        }
    }

    // Get Single Attendance
    async getAttendanceById(req: Request, res: Response, next: NextFunction) {
        try {
        const { id } = req.params;

        const { status, resBody }: serviceReturnType =
            await this._attendanceService.getAttendanceById(id!);

        res.status(status).json(resBody);
        } catch (err) {
        next(err);
        }
    }

    // List Attendance
    async getAllAttendance(req: Request, res: Response, next: NextFunction) {
        try {
        const query = req.query;

        const { status, resBody }: serviceReturnType =
            await this._attendanceService.listAttendance(query);

        res.status(status).json(resBody);
        } catch (err) {
        next(err);
        }
    }

    // Update Attendance
    async updateAttendance(req: Request, res: Response, next: NextFunction) {
        try {
        const { status, resBody }: serviceReturnType = await this._attendanceService.updateAttendance(
            req,
            res,
        );

        res.status(status).json(resBody);
        } catch (err) {
        next(err);
        }
    }

    // Delete Attendance
    async deleteAttendance(req: Request, res: Response, next: NextFunction) {
        try {
        const { status, resBody }: serviceReturnType =
            await this._attendanceService.deleteAttendance(req);

        res.status(status).json(resBody);
        } catch (err) {
        next(err);
        }
    }

    // View Attendance
    async viewAttendance(req: Request, res: Response, next: NextFunction) {
        try {
        const { status, resBody }: serviceReturnType =
            await this._attendanceService.viewAttendance(req);

        res.status(status).json(resBody);
        } catch (err) {
        next(err);
        }
    }

    // View Attendance
    async getAAttendanceList(req: Request, res: Response, next: NextFunction) {
        try {
        const { status, resBody }: serviceReturnType =
            await this._attendanceService.getAttendanceOfAStudent(req);

        res.status(status).json(resBody);
        } catch (err) {
        next(err);
        }
    }

    //----Apply leave----
    async applyLeave(req: Request, res: Response, next: NextFunction) {
        try {
        const { status, resBody }: serviceReturnType =
            await this._attendanceService.setApplyLeave(req);

        res.status(status).json(resBody);
        } catch (err) {
        next(err);
        }
    }

    async getLeaveList(req: Request, res: Response, next: NextFunction) {
        try {
        const { status, resBody }: serviceReturnType =
            await this._attendanceService.getStudentLeaveHistory(req);

        res.status(status).json(resBody);
        } catch (err) {
        next(err);
        }
    }
}
