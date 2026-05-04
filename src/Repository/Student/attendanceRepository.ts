// @Repository/Student/StudentAttendanceRepository.ts

import { injectable } from 'tsyringe';
import { FilterQuery, Types } from 'mongoose';
import { BaseRepository } from '@Repository/BaseRepository';
import logger from '@Utils/logger';
import { IStudentAttendanceRepository } from '@Interfaces/repository/IAttendanceRepository';
import studentAttendanceModel, { IAttendance } from '@Models/Student/attendanceModel';
import {
  IStudentLeave,
  leaveApproveStatus,
  studentLeaveModel,
} from '@Models/Student/applyLeaveModel';
import { AttendanceMessage, LeaveMessage } from '@Constants/resposeMessages';

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

  async getAttendanceOfBatchByBatchId(
    batchId: string,
    start: Date | string,
    end: Date,
  ): Promise<IAttendance | null> {
    try {
      return await this.model.findOne({
        batchId: batchId,
        date: {
          $gte: start,
          $lt: end,
        },
      });
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
    month: number,
  ): Promise<Record<number, string>> {
    try {
      // Start & End of month
      const numericMonth = Number(month);
      const startDate = new Date(year, numericMonth, 1);
      const endDate = new Date(year, numericMonth + 1, 0);

      const attendanceDocs = await this.model.find({
        'students.studentId': studentId,
        date: { $gte: startDate, $lte: endDate },
        isDelete: false,
      });

      const result: Record<number, string> = {};

      attendanceDocs.forEach((doc) => {
        const day = new Date(doc.date).getUTCDate();

        const student = doc.students.find((s) => s.studentId.toString() === studentId);

        if (student) {
          result[day] = student.status;
        }
      });

      return result;
    } catch (error) {
      logger.error('Error while fetching attendance:', error);
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

  async updateAttendanceStatus(
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
  async applyLeave(
    filter: FilterQuery<Partial<IStudentLeave>>,
    update: FilterQuery<Partial<IStudentLeave>>,
  ): Promise<void> {
    try {
      return await studentLeaveModel.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true, // create if not exists
      });
    } catch (error) {
      logger.error(LeaveMessage.LeaveNotUpdated, error);
      return;
    }
  }

  async updateAppliedLeaveStatusFromTeacher(
    filter: FilterQuery<Partial<IStudentLeave>>,
    update: FilterQuery<Partial<IStudentLeave>>,
  ): Promise<IAttendance|null> {
    try {
      const updated= await this.model.findOneAndUpdate(filter, update, {
        new: true,
      });

      return updated;

    } catch (error) {
      logger.error(AttendanceMessage.AttendanceNotUpdated, error);
      return null;
    }
  }

  async getLeaves(filter: FilterQuery<Partial<IStudentLeave>>): Promise<IStudentLeave | null> {
    try {
      return await studentLeaveModel.findOne(filter,
        {
          "leaveHistory.$": 1,
        }
      ).lean<IStudentLeave>();

    } catch (error) {
      logger.error(LeaveMessage.LeaveNotFound, error);
      return null;
    }
  }

  async updateStudentLeave(
    filter: FilterQuery<Partial<IStudentLeave>>,
    date: Date | string,
    status: leaveApproveStatus,
  ): Promise<IStudentLeave | null> {
    try {
      return await studentLeaveModel
        .findOneAndUpdate(
          {
            ...filter,
            'leaveHistory.date': date,
          },
          {
            $set: {
              'leaveHistory.$.status': status,
            },
          },
          { new: true },
        )
        .lean<IStudentLeave>();
    } catch (error) {
      logger.error('Leave update failed', error);
      return null;
    }
  }

  public async fetchMonthlyAttendance(filterQuery:FilterQuery<Partial<IAttendance>>)
  :Promise<Partial<IAttendance[]|null>> {
    
    try {

      console.log('@attendanceRepository filterQuery',filterQuery);

        const data = await this.model.aggregate([
          {
            $match: {
              ...filterQuery,
              isDelete: false,
            },
          },

          //  break students array
          { $unwind: "$students" },

          //  classify present
          {
            $addFields: {
              isPresent: {
                $cond: [
                  { $in: ["$students.status", ["present", "late"]] },
                  1,
                  0,
                ],
              },
            },
          },

          //  group result
          {
            $group: {
              _id: null,
              totalPresent: { $sum: "$isPresent" },
              totalCount: { $sum: 1 },
            },
          },

          {
            $project: {
              _id: 0,
              totalPresent: 1,
              totalCount: 1,
              attendancePercentage: {
                $multiply: [
                  { $divide: ["$totalPresent", "$totalCount"] },
                  100,
                ],
              },
            },
          },
        ]);

        console.log("@attendance_repository data",data);
        return data;

      } catch(error) {

        logger.error(AttendanceMessage.AttendanceNotFound,error);

        return null;
      }
  }

}
