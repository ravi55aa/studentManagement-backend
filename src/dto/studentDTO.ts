import { Types } from 'mongoose';
import { IStudent } from '@Models/Student/studentModel';
import { Request, Response } from 'express';
import { IAttendance } from '@Models/Student/attendanceModel';
import { IStudentLeave } from '@Models/Student/applyLeaveModel';
import { CommonMessage } from '@Constants/resposeMessages';

import { SchoolAcademicYearDto } from './schoolDTO';

export class StudentDTO {

  static createStudent(req: Request): Partial<IStudent> {
    const data: Partial<IStudent> = req.body;

    const profile = this.handleProfile(req);

    const returnData: Partial<IStudent> = {
      name: data.name!,
      email: data.email!,
      phone: data.phone!,
      dateOfBirth: data.dateOfBirth!,
      rollNumber: data.rollNumber!,
      gender: data.gender!,
      parentName: data.parentName!,
      parentPhone: data.parentPhone!,
      password: data.password!,

      profile: profile || '',
    };

    return returnData;
  }

  static updateStudent(req: Request): Partial<IStudent> {
    const data: Partial<IStudent> = req.body;

    const profile = this.handleProfileV2(req);

    const returnUpdated: Partial<IStudent> = {
      ...(data?.name && {
        name: data.name,
      }),

      ...(data?.email && {
        email: data.email,
      }),

      ...(data?.phone && {
        phone: data.phone,
      }),

      ...(data?.gender && {
        gender: data.gender,
      }),

      ...(data?.parentName && {
        parentName: data.parentName,
      }),

      ...(data?.parentPhone && {
        parentPhone: data.parentPhone,
      }),

      ...(data?.status && {
        status: data.status,
      }),

      ...(data?.dateOfBirth && {
        dateOfBirth: data.dateOfBirth!,
      }),

      ...(profile && {
        profile: req.file?.path,
      }),
    };

    return returnUpdated;
  }

  static handleProfile(req: Request) {
    const files = req.files as {
      profile?: Express.Multer.File[];
    };

    const profile = files?.profile?.[0]?.path;

    return profile;
  }

  static handleProfileV2(req: Request) {
    const profile = req.file?.path;

    return profile;
  }
}

// Attendance Dto

export class AttendanceDto {

  static markAttendance(req: Request, res: Response): Partial<IAttendance> {
    const { batchId } = req.params;
    const {date}=req.query as {date:string};

    const [year, month, day] = date.split("-").map(Number);
    const today = new Date(Date.UTC(year!, month! - 1, day));

    const decoded = SchoolAcademicYearDto.getTenantId(req, res);

    return {
      batchId: new Types.ObjectId(batchId),
      date: today,
      students: req.body,
      teacherId: decoded.adminId,
    };
  }

  static applyLeave(req: Request): Partial<IStudentLeave> {
    const { reason, body } = req.body;
    const { studentId } = req.params;
    //const { batchId } = req.query;

    const attachment = req.file?.path || '';

    if ( !studentId || !reason || !body) {
      throw new Error(CommonMessage.IdNotFound);
    }

    return {
      //batchId: new Types.ObjectId(batchId as string),
      studentId: new Types.ObjectId(studentId),
      leaveHistory: [
        {
          reason,
          body,
          attachment,
          date: new Date(), 
        },
      ],
    };
  }

}
