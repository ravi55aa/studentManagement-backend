// @Interfaces/repository/IStudentAttendanceRepository.ts

import { FilterQuery, Types } from 'mongoose';
import { IAttendance } from '@Models/Student/attendanceModel';
import { IStudentLeave, leaveApproveStatus } from '@Models/Student/applyLeaveModel';

export interface IStudentAttendanceRepository {
  markAttendance(data: Partial<IAttendance>): Promise<IAttendance | null>;

  findAttendanceById(id: string): Promise<IAttendance | null>;

  getAttendance(query: FilterQuery<Partial<IAttendance>>): Promise<IAttendance[]>;

  updateAttendance(
    id: string | Types.ObjectId,
    updateData: Partial<IAttendance>,
  ): Promise<IAttendance | null>;

  deleteAttendance(id: string): Promise<boolean>;

  getAttendanceOfAStudent(
    studentId: string | unknown,
    year: number | unknown,
    month: number | unknown,
  ): Promise<Record<number, string>>;

  getAttendanceOfBatchByBatchId( batchId: string,
      start: Date|string,
      end: Date): Promise<IAttendance | null> 

  //APPLY-LEAVE
  applyLeave(
    filter: FilterQuery<Partial<IStudentLeave>>,
    update: FilterQuery<Partial<IStudentLeave>>,
  ): Promise<void>;

  updateAppliedLeaveStatusFromTeacher(
      filter: FilterQuery<Partial<IStudentLeave>>,
      update: FilterQuery<Partial<IStudentLeave>>,
    ): Promise<void|null>

  getLeaves(filter: FilterQuery<Partial<IStudentLeave>>): Promise<IStudentLeave | null>;

  updateStudentLeave(
      filter: FilterQuery<Partial<IStudentLeave>>,
      date: Date,
      status:leaveApproveStatus):Promise<IStudentLeave | null> 
}
