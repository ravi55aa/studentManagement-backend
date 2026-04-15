import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { IAttendance } from '@Models/Student/attendanceModel';
import { serviceReturnType } from '@Constants/interfaces';

export interface IStudentAttendanceService {
  // Mark Attendance
  markAttendance(req: Request, res: Response): Promise<serviceReturnType>;

  //  Get Single Attendance
  getAttendanceById(id: string): Promise<serviceReturnType>;

  // List Attendance
  listAttendance(query: FilterQuery<Partial<IAttendance>>): Promise<serviceReturnType>;

  // Update Attendance
  updateAttendance(req: Request, res: Response): Promise<serviceReturnType>;

  // Delete Attendance
  deleteAttendance(req: Request): Promise<serviceReturnType>;

  // View Attendance (alias of get)
  viewAttendance(req: Request): Promise<serviceReturnType>;

  //view attendance of a student
  getAttendanceOfAStudent(req: Request): Promise<serviceReturnType>;
  
  //view Batch Attendance by Date
  getAttendanceOfBatch(req: Request): Promise<serviceReturnType>

  //----Apply leave----
  setApplyLeave(req: Request,res:Response): Promise<serviceReturnType>;

  updateAppliedLeaveStatus(req:Request):Promise<serviceReturnType>;

  getStudentLeaveHistory(req: Request): Promise<serviceReturnType>;
}
