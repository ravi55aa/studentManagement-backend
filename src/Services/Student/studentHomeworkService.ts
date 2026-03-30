import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { ApiResponse } from '@Constants/apiResponse';
import { serviceReturnType } from '@Constants/interfaces';
import { HomeworkMessage } from '@Constants/resposeMessages';
import { TYPES } from '@DI/types';
import { FilterQuery } from 'mongoose';
import { IHomeworkSubmission } from '@Models/Student/homeworkSubmitModel';
import { IStudentHomeworkRepository } from '@Interfaces/repository/IHomeworkStudentRepository';
import { IStudentHomeworkService } from '@Interfaces/services/IHomeworkStudentService';
import { HomeworkSubmissionDto } from '@dto/homeworkStudentDTO';

@injectable()
export class StudentHomeworkService implements IStudentHomeworkService {
  constructor(
    @inject(TYPES.StudentHomeworkRepository)
    private _homeworkRepo: IStudentHomeworkRepository,
  ) {}

  // Submit Homework
  async submitHomework(req: Request, res: Response): Promise<serviceReturnType> {
    const dto: Partial<IHomeworkSubmission> = HomeworkSubmissionDto.submitHomework(req, res);

    const doc = await this._homeworkRepo.submitHomework(dto);

    return ApiResponse.success(doc, HomeworkMessage.HomeworkSubmitted);
  }

  // Get Single Submission
  async getSubmission(id: string): Promise<serviceReturnType> {
    const doc = await this._homeworkRepo.findSubmissionById(id);

    if (!doc) {
      return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
    }

    return ApiResponse.success(doc, HomeworkMessage.HomeworkFetched);
  }

  // List Student Submissions
  async listStudentSubmissions(
    query: FilterQuery<Partial<IHomeworkSubmission>>,
  ): Promise<serviceReturnType> {
    const docs = await this._homeworkRepo.getStudentSubmissions(query);

    if (!docs || docs.length === 0) {
      return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
    }

    return ApiResponse.success(docs, HomeworkMessage.HomeworkListed);
  }

  async getallSubmission(
    query: FilterQuery<Partial<IHomeworkSubmission>>,
  ): Promise<serviceReturnType> {
    const docs = await this._homeworkRepo.getStudentSubmissions(query);

    if (!docs || docs.length === 0) {
      return ApiResponse.failure(HomeworkMessage.HomeworkSubmissionNotFound);
    }
    return ApiResponse.success(docs, HomeworkMessage.HomeworkListed);
  }

  // Delete Submission
  async deleteSubmission(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;

    const deleted = await this._homeworkRepo.deleteSubmission(id!);

    if (!deleted) {
      return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
    }

    return ApiResponse.success(null, HomeworkMessage.HomeworkDeleted);
  }

  // View Homework Details
  async viewHomework(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;

    const doc = await this._homeworkRepo.findSubmissionById(id!);

    if (!doc) {
      return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
    }

    return ApiResponse.success(doc, HomeworkMessage.HomeworkFetched);
  }

    // Update Submission (Resubmit)
  async updateSubmission(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;

    const dto: Partial<IHomeworkSubmission> = HomeworkSubmissionDto.updateHomework(req);

    const updatedDoc = await this._homeworkRepo.updateSubmission(id!, dto);

    if (!updatedDoc) {
      return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
    }

    return ApiResponse.success(updatedDoc, HomeworkMessage.HomeworkUpdated);
  }

  public async updateAllSubmission(req: Request): Promise<serviceReturnType> {
      const { homeworkId } = req.params;

      const doc = await this._homeworkRepo.findSubmissionById(homeworkId!);

      if (!doc) {
        return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
      }

      return ApiResponse.success(doc, HomeworkMessage.HomeworkFetched);
  }
}
