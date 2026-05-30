import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import mongoose, { FilterQuery } from 'mongoose';
import { IAttendance } from '@Models/Student/attendanceModel';
import { ApiResponse } from '@Constants/apiResponse';
import { serviceReturnType } from '@Constants/interfaces';
import { AttendanceDto } from '@dto/studentDTO';
import { TYPES } from '@DI/types';
import { IStudentAttendanceRepository } from '@Interfaces/repository/IAttendanceRepository';
import { IStudentAttendanceService } from '@Interfaces/services/IAttendanceService';
import { IStudentLeave, leaveApproveStatus } from '@Models/Student/applyLeaveModel';
import {
  AttendanceMessage,
  CommonMessage,
  LeaveMessage,
  ServerMessage,
} from '@Constants/resposeMessages';
import logger from '@Utils/logger';
import { leaveDocValidationSchema } from '@Validators/student.validation';
import { handleValidationOF } from '@Middlewares/validateUser.middleware';
import { FailureError, InternalServerError, NotFoundError } from '@Middlewares/narrowDownErrors';

import { convertToIsoString, convertToUTC } from '../../helper/getUtc';

@injectable()
export class StudentAttendanceService implements IStudentAttendanceService {
  constructor(
    @inject(TYPES.StudentAttendanceRepository)
    private _attendanceRepo: IStudentAttendanceRepository,
  ) {}

  // Mark Attendance
  async markAttendance(req: Request, res: Response): Promise<serviceReturnType> {
    try {
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
          throw new FailureError(AttendanceMessage.AttendanceAlreadyMarked);
        }
      }

      const doc = await this._attendanceRepo.markAttendance(dto);

      return ApiResponse.success(doc, AttendanceMessage.AttendanceMarked);
    } catch (error) {
      logger.error('Error marking attendance:', error);
      throw new InternalServerError();
    }
  }

  //  Get Single Attendance
  async getAttendanceById(id: string): Promise<serviceReturnType> {
    try {
      const doc = await this._attendanceRepo.findAttendanceById(id);

      if (!doc) {
        throw new FailureError(AttendanceMessage.AttendanceNotFound);
      }

      return ApiResponse.success(doc, AttendanceMessage.AttendanceFetched);
    } catch (error) {
      logger.error('Error fetching attendance:', error);
      throw new InternalServerError();
    }
  }

  // List Attendance
  async listAttendance(query: FilterQuery<Partial<IAttendance>>): Promise<serviceReturnType> {
    try {
      const docs = await this._attendanceRepo.getAttendance(query);

      if (!docs || docs.length === 0) {
        throw new FailureError(AttendanceMessage.AttendanceNotUpdated);
      }

      return ApiResponse.success(docs, AttendanceMessage.AttendanceListed);
    } catch (error) {
      logger.error('Error listing attendance:', error);
      throw new InternalServerError();
    }
  }

  //  Update Attendance
  async updateAttendance(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const { batchId } = req.params;

      const dto: Partial<IAttendance> = AttendanceDto.markAttendance(req, res);

      const updatedDoc = await this._attendanceRepo.updateAttendance(batchId!, dto);

      if (!updatedDoc) {
        throw new FailureError(AttendanceMessage.AttendanceNotFound);
      }

      return ApiResponse.success(updatedDoc, AttendanceMessage.AttendanceUpdated);
    } catch (error) {
      logger.error('Error updating attendance:', error);
      throw new InternalServerError();
    }
  }

  async getAttendanceOfBatch(req: Request): Promise<serviceReturnType> {
    try {
      const { batchId, date } = req.query as {
        batchId: string;
        date: string;
      };

      // Validation
      if (!batchId || !date) {
        throw new NotFoundError('StudentId and Date are required');
      }

      // Create date range
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      // Call repo
      const attendance = await this._attendanceRepo.getAttendanceOfBatchByBatchId(
        batchId,
        start,
        end,
      );

      if (!attendance || attendance === null) {
        throw new FailureError(AttendanceMessage.AttendanceNotFound);
      }

      return ApiResponse.success(attendance, AttendanceMessage.AttendanceListed);
    } catch (error) {
      logger.error('Service Error:', error);
      throw new InternalServerError();
    }
  }

  // Delete Attendance
  async deleteAttendance(req: Request): Promise<serviceReturnType> {
    try {
      const { id } = req.params; //studentId

      const deleted = await this._attendanceRepo.deleteAttendance(id!);

      if (!deleted) {
        throw new FailureError(AttendanceMessage.AttendanceNotFound);
      }

      return ApiResponse.success(null, AttendanceMessage.AttendanceDeleted);
    } catch (error) {
      logger.error('Error deleting attendance:', error);
      throw new InternalServerError();
    }
  }

  // View Attendance (same as get)
  async viewAttendance(req: Request): Promise<serviceReturnType> {
    try {
      const { id } = req.params;

      const doc = await this._attendanceRepo.findAttendanceById(id!);

      if (!doc) {
        throw new FailureError(AttendanceMessage.AttendanceNotFound);
      }

      return ApiResponse.success(doc, AttendanceMessage.AttendanceFetched);
    } catch (error) {
      logger.error('Error viewing attendance:', error);
      throw new InternalServerError();
    }
  }

  async getAttendanceOfAStudent(req: Request): Promise<serviceReturnType> {
    try {
      const { studentId, year, month } = req.query;

      const attendance = await this._attendanceRepo.getAttendanceOfAStudent(studentId, year, month);

      if (!attendance) {
        throw new FailureError(AttendanceMessage.AttendanceNotFound);
      }

      return ApiResponse.success(attendance, AttendanceMessage.AttendanceListed);
    } catch (error) {
      logger.error('Error fetching student attendance:', error);
      throw new InternalServerError();
    }
  }

  //-----Apply-leave-----

  async setApplyLeave(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const dto: Partial<IStudentLeave> = AttendanceDto.applyLeave(req);

      const { studentId, leaveHistory } = dto; //batchId

      if (!leaveHistory || leaveHistory == undefined) {
        return ApiResponse.badRequest(LeaveMessage.LeaveCredentialsNotFound);
      }
      const leave = leaveHistory[0];

      if (!leave?.body || !leave?.reason) {
        return ApiResponse.badRequest(LeaveMessage.LeaveCredentialsNotFound);
      }

      const validationData = {
        reason: leave.reason,
        body: leave.body,
        attachment: leave.attachment,
      };

      //validation
      handleValidationOF(leaveDocValidationSchema, validationData, res);

      //const { from, to } = req.query;

      // const leaves = data.leaveHistory.filter((l: any) => {
      //     const d = new Date(l.date);
      //     return d >= new Date(from as string) && d <= new Date(to as string);
      // });

      // Normalize date
      const date = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

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
    } catch (error) {
      logger.error('Error applying leave:', error);
      throw new InternalServerError();
    }
  }

  async updateAppliedLeaveStatus(req: Request): Promise<serviceReturnType> {
    try {
      const { batchId, studentId } = req.params;
      const { date, status } = req.query as { date: string; status: unknown };

      console.log("Hi");

      if (!batchId || !studentId) {
        logger.error(CommonMessage.IdNotFound, batchId, studentId, {
          layer: 'service',
          module: 'studentAttendance',
        });

        throw new NotFoundError(CommonMessage.IdNotFound);
      }

      const start = convertToUTC(date);
      const dd = convertToIsoString(date);

      const nextDay = new Date(start);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);

      if (!date || !status) {
        logger.error('Credential missing date:%s status:%j', start, status, batchId, studentId, {
          layer: 'service',
          module: 'studentAttendance',
        });

        throw new NotFoundError(LeaveMessage.LeaveCredentialsNotFound);
      }

      //Formate: filter and query
      const filter = {
        batchId,
        date: {
          $gte: start,
          $lt: nextDay,
        },
        'students.studentId': studentId,
      };

      const leaveStatus = status == 'approved' ? 'leave' : 'absent';

      const update = { $set: { 'students.$.status': leaveStatus } };

      //make a repository call;
      await this._attendanceRepo.updateAppliedLeaveStatusFromTeacher(
        filter,
        update,
      );

      // if (!updated) {
      //   throw new FailureError(AttendanceMessage.AttendanceNotUpdated);
      // }

      await this._attendanceRepo.updateStudentLeave(
        { studentId: studentId },
        dd as string,
        status as leaveApproveStatus,
      );

      return ApiResponse.success(null, LeaveMessage.LeaveUpdated);
    } catch (error) {
      logger.error(LeaveMessage.LeaveRejected, error);
      throw new InternalServerError();
    }
  }

  async getStudentLeaveHistory(req: Request): Promise<serviceReturnType> {
    try {
      const { studentId } = req.params; //batchId->if Necessary
      let { date } = req.query as { date: string };

      if (!date) {
        date = '2026-4-11'; //some random value
      }

      const start = new Date(`${date}T00:00:00.000+05:30`);
      const end = new Date(`${date}T23:59:59.999+05:30`);

      if (!studentId) {
        throw new NotFoundError(CommonMessage.IdNotFound);
      }

      const data = await this._attendanceRepo.getLeaves({
        studentId,
        leaveHistory: {
          $elemMatch: {
            date: {
              $gte: start,
              $lte: end,
            },
          },
        },
      });

      if (!data) {
        return ApiResponse.failure(LeaveMessage.LeaveNotFound);
      }

      return ApiResponse.success(data.leaveHistory, LeaveMessage.LeaveListed);
    } catch (error) {
      logger.error('Error fetching leave history:', error);
      throw new InternalServerError();
    }
  }

  async getAttendanceByYear(req: Request): Promise<serviceReturnType> {
    try {
      const { batchId } = req.params;
      const { academicYear } = req.query as { academicYear: string };

      if (!batchId || !academicYear) {
        throw new NotFoundError(CommonMessage.IdNotFound);
      }

      const year = Number(academicYear);

      if (isNaN(year)) {
        throw new Error('Invalid academicYear');
      }

      //  Correct IST → UTC handling (no ISO conversion)

      const startUtc = new Date(`${year}-04-01T00:00:00.000Z`);

      const endUtc = new Date(`${year}-04-31T23:59:59.999Z`);

      const query = {
        batchId: new mongoose.Types.ObjectId(batchId),
        date: {
          $gte: startUtc,
          $lte: endUtc,
        },
      };

      const data = await this._attendanceRepo.fetchMonthlyAttendance(query);

      return ApiResponse.success(data, AttendanceMessage.AttendanceFetched);
    } catch (error) {
      logger.error(ServerMessage.ServerError, error);
      throw new Error('@ AttendanceService', { cause: error });
    }
  }
}
