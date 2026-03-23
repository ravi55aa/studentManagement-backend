// @Repository/Student/StudentAttendanceRepository.ts

import { injectable } from 'tsyringe';
import { FilterQuery, Types } from 'mongoose';
import { BaseRepository } from '@Repository/BaseRepository';
import logger from '@Utils/logger';
import { IStudentAttendanceRepository } from '@Interfaces/repository/IAttendanceRepository';
import studentAttendanceModel, { IAttendance } from '@Models/Student/attendanceModel';
import { IStudentLeave, studentLeaveModel } from '@Models/Student/applyLeaveModel';
import { LeaveMessage } from '@Constants/resposeMessages';

@injectable()
export class StudentAttendanceRepository
  extends BaseRepository<IAttendance>
  implements IStudentAttendanceRepository
{
    constructor() {
      super(studentAttendanceModel);
    }

    // Mark Attendance (Create)
    async markAttendance(data: Partial<IAttendance>): Promise<IAttendance | null> {
      try {
        return await this.create(data);
      } catch (error) {
        logger.error('Error while marking attendance:', error);
        return null;
      }
    }

    // Find Attendance by ID
    async findAttendanceById(id: string): Promise<IAttendance | null> {
      try {
        return await super.findById(id);
      } catch (error) {
        logger.error('Error while finding attendance by id:', error);
        return null;
      }
    }

    // Get Attendance (with populate)
    async getAttendance(query: FilterQuery<Partial<IAttendance>>): Promise<IAttendance[]> {
      try {
        const attendance = await this.model
          .find({ ...query })
          .populate('batchId', 'name')
          .populate('teacherId', 'name email')
          .lean<IAttendance[]>();

        return attendance;
      } catch (error) {
        logger.error('Error while fetching attendance:', error);
        return [];
      }
    }
    
    async getAttendanceOfAStudent(
      studentId: string,
      year: number,
      month: number
    ): Promise<Record<number, string>> {
      try {
        // Start & End of month
        const startDate = new Date(year, month-1, 1);
        const endDate = new Date(year, month + 1, 0);

        const attendanceDocs = await this.model.find({
          "students.studentId": studentId,
          date: { $gte: startDate, $lte: endDate },
          isDelete: false,
        });

        const result: Record<number, string> = {};

        attendanceDocs.forEach((doc) => {
          const day = new Date(doc.date).getUTCDate();

          const student = doc.students.find(
            (s) => s.studentId.toString() === studentId
          );

          if (student) {
            result[day] = student.status;
          }
        });

        return result;
      } catch (error) {
        logger.error("Error while fetching attendance:", error);
        return {};
      }
    }

    // Update Attendance
    async updateAttendance(
      id: string,
      updateData: Partial<IAttendance>,
    ): Promise<IAttendance | null> {
      try {
        return await this.updateById(id, updateData);
      } catch (error) {
        logger.error('Error while updating attendance:', error);
        return null;
      }
    }

    // Soft Delete Attendance
    async deleteAttendance(id: string): Promise<boolean> {
      try {
        if (!Types.ObjectId.isValid(id)) {
          return false;
        }

        const result = await this.model.updateOne({ _id: id }, { $set: { isDelete: true } });

        return result.modifiedCount === 1;
      } catch (error) {
        logger.error('Error while deleting attendance:', error);
        return false;
      }
    }


  //--------ApplyLeave--------
  async applyLeave(filter: FilterQuery<Partial<IStudentLeave>>, update: FilterQuery<Partial<IStudentLeave>>): Promise<void> {
    try {
      return await studentLeaveModel.findOneAndUpdate(
          filter,
          update,
          {
              new: true,
              upsert: true, // create if not exists
          }
      );
        
      } catch (error) {
        logger.error(LeaveMessage.LeaveNotUpdated, error);
        return ;
      }
  }

  async getLeaves(filter: FilterQuery<Partial<IStudentLeave>>):Promise<IStudentLeave|null> {
    try {
        return await studentLeaveModel.findOne(filter).lean<IStudentLeave>();
        
      } catch (error) {
        logger.error(LeaveMessage.LeaveNotFound, error);
        return null;
      }
  }

}
