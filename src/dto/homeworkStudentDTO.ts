import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { IHomeworkSubmission } from '@Models/Student/homeworkSubmitModel';

import { SchoolAcademicYearDto } from './schoolDTO';

export class HomeworkSubmissionDto {
  static submitHomework(req: Request, res: Response): Partial<IHomeworkSubmission> {
    const { note, links } = req.body;
    const { homeworkId } = req.params;

    const attachments = ((req.files as Express.Multer.File[]) || []).map((file) => ({
      url: file.path,
      fileName: file.originalname,
    }));

    const decoded = SchoolAcademicYearDto.getTenantId(req, res);

    return {
      note,
      links,
      attachments,
      submittedAt: new Date(),
      status: 'submitted',
      studentId: decoded.adminId,
      homeworkId: new mongoose.Types.ObjectId(homeworkId),
    };
  }

  static updateHomework(req: Request): Partial<IHomeworkSubmission> {
    const data: Partial<IHomeworkSubmission> = req.body;

    const attachments = ((req.files as Express.Multer.File[]) || []).map((file) => ({
      url: file.path,
      fileName: file.originalname,
    }));

    return {
      ...data,
      ...(data.note && { note: data.note }),
      ...(data.attachments && { attachments: attachments }),
      ...(data.links && { links: data.links }),
      ...(data.status && { status: data.status }),
    };
  }
}
