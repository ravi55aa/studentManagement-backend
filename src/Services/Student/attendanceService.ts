import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { FilterQuery } from 'mongoose';
import { IAttendance } from '@Models/Student/attendanceModel';
import { ApiResponse } from '@Constants/apiResponse';
import { serviceReturnType } from '@Constants/interfaces';
import { AttendanceDto } from '@dto/studentDTO';
import { TYPES } from '@DI/types';
import { IStudentAttendanceRepository } from '@Interfaces/repository/IAttendanceRepository';
import { IStudentAttendanceService } from '@Interfaces/services/IAttendanceService';
import { IStudentLeave } from '@Models/Student/applyLeaveModel';
import { AttendanceMessage, CommonMessage, LeaveMessage } from '@Constants/resposeMessages';
import logger from '@Utils/logger';
import { leaveDocValidationSchema } from '@Validators/student.validation';
import { handleValidationOF } from '@Middlewares/validateUser.middleware';

@injectable()
export class StudentAttendanceService implements IStudentAttendanceService {
    constructor(
        @inject(TYPES.StudentAttendanceRepository)
        private _attendanceRepo: IStudentAttendanceRepository,
    ) {}

    // Mark Attendance
    async markAttendance(req: Request, res: Response): Promise<serviceReturnType> {
        const dto: Partial<IAttendance> = AttendanceDto.markAttendance(req, res);

        // Prevent duplicate attendance
        const existing = await this._attendanceRepo.getAttendance({
        batchId: dto.batchId,
        date: dto.date,
        });

        if (existing.length > 0) {
        const list = existing[0];
        const updated = await this._attendanceRepo.updateAttendance(list!._id, {
            students: dto.students!,
        });

        if (!updated) {
            return ApiResponse.failure(AttendanceMessage.AttendanceAlreadyMarked);
        }
        }

        const doc = await this._attendanceRepo.markAttendance(dto);

        return ApiResponse.success(doc, AttendanceMessage.AttendanceMarked);
    }

    //  Get Single Attendance
    async getAttendanceById(id: string): Promise<serviceReturnType> {
        const doc = await this._attendanceRepo.findAttendanceById(id);

        if (!doc) {
        return ApiResponse.failure(AttendanceMessage.AttendanceNotFound);
        }

        return ApiResponse.success(doc, AttendanceMessage.AttendanceFetched);
    }

    // List Attendance
    async listAttendance(query: FilterQuery<Partial<IAttendance>>): Promise<serviceReturnType> {
        const docs = await this._attendanceRepo.getAttendance(query);

        if (!docs || docs.length === 0) {
            return ApiResponse.failure(AttendanceMessage.AttendanceNotUpdated);
        }

        return ApiResponse.success(docs, AttendanceMessage.AttendanceListed);
    }

    //  Update Attendance
    async updateAttendance(req: Request, res: Response): Promise<serviceReturnType> {
        const { batchId } = req.params;

        const dto: Partial<IAttendance> = AttendanceDto.markAttendance(req, res);

        const updatedDoc = await this._attendanceRepo.updateAttendance(batchId!, dto);

        if (!updatedDoc) {
        return ApiResponse.failure(AttendanceMessage.AttendanceNotFound);
        }

        return ApiResponse.success(updatedDoc, AttendanceMessage.AttendanceUpdated);
    }

    async getAttendanceOfBatch(req: Request): Promise<serviceReturnType> {
    try {
            const { batchId, date } = req.query as {
                batchId: string;
                date: string;
            };

            // Validation
            if (!batchId || !date) {
                return ApiResponse.failure("StudentId and Date are required");
            }

            // Create date range
            const start = new Date(date);
            const end = new Date(date);
            end.setDate(end.getDate() + 1);

            // Call repo
            const attendance = await this._attendanceRepo.getAttendanceOfBatchByBatchId(
                batchId,
                start,
                end
            );

            if (!attendance || attendance=== null) {
                return ApiResponse.failure(AttendanceMessage.AttendanceNotFound);
            }

            return ApiResponse.success(
                attendance,
                AttendanceMessage.AttendanceListed
            );

        } catch (error) {
            logger.error("Service Error:", error);
            return ApiResponse.failure("Something went wrong");
        }
    }

    // Delete Attendance
    async deleteAttendance(req: Request): Promise<serviceReturnType> {
        const { id } = req.params;

        const deleted = await this._attendanceRepo.deleteAttendance(id!);

        if (!deleted) {
        return ApiResponse.failure(AttendanceMessage.AttendanceNotFound);
        }

        return ApiResponse.success(null, AttendanceMessage.AttendanceDeleted);
    }

    // View Attendance (same as get)
    async viewAttendance(req: Request): Promise<serviceReturnType> {
        const { id } = req.params;

        const doc = await this._attendanceRepo.findAttendanceById(id!);

        if (!doc) {
        return ApiResponse.failure(AttendanceMessage.AttendanceNotFound);
        }

        return ApiResponse.success(doc, AttendanceMessage.AttendanceFetched);
    }

    async getAttendanceOfAStudent(req: Request): Promise<serviceReturnType> {
        const { studentId, year, month } = req.query;

        const attendance = await this._attendanceRepo.getAttendanceOfAStudent(studentId, year, month);

        if (!attendance) {
        return ApiResponse.failure(AttendanceMessage.AttendanceNotFound);
        }

        return ApiResponse.success(attendance, AttendanceMessage.AttendanceListed);
    }

    //-----Apply-leave-----

    async setApplyLeave(req: Request,res:Response): Promise<serviceReturnType> {
        
        const dto: Partial<IStudentLeave> = AttendanceDto.applyLeave(req);

        const { studentId, leaveHistory } = dto; //batchId
        
        if(!leaveHistory || leaveHistory==undefined){
            return ApiResponse.badRequest(LeaveMessage.LeaveCredentialsNotFound);
        }
        const leave = leaveHistory[0];
        
        if(!leave?.body || !leave?.reason) {
            return ApiResponse.badRequest(LeaveMessage.LeaveCredentialsNotFound);
        }

        const validationData = {
            reason:leave.reason,
            body:leave.body,
            attachment:leave.attachment
        };

        //validation
        handleValidationOF(leaveDocValidationSchema,validationData,res);

        //const { from, to } = req.query;

        // const leaves = data.leaveHistory.filter((l: any) => {
        //     const d = new Date(l.date);
        //     return d >= new Date(from as string) && d <= new Date(to as string);
        // });

        // Normalize date
        const date = new Date(leave!.date!);
        date.setHours(0, 0, 0, 0);

        const updated = await this._attendanceRepo.applyLeave(
        { studentId }, //batchId
        {
            $push: {
            leaveHistory: {
                ...leave,
                date,
            },
            },
        },
        );

        return ApiResponse.success(updated, LeaveMessage.LeaveApplied);
    }

    async getStudentLeaveHistory(req: Request): Promise<serviceReturnType> {
        const { studentId } = req.query; //batchId->if Necessary

        if ( !studentId) {
            return ApiResponse.failure(CommonMessage.IdNotFound);
        }

        const data = await this._attendanceRepo.getLeaves(
            {studentId}
        );

        if (!data) {
        return ApiResponse.success([], LeaveMessage.LeaveNotFound);
        }

        return ApiResponse.success(data.leaveHistory, LeaveMessage.LeaveListed);
    }
}
