import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { ApiResponse } from '@Constants/apiResponse';
import { serviceReturnType } from '@Constants/interfaces';
import { CommonMessage, HomeworkMessage } from '@Constants/resposeMessages';
import { TYPES } from '@DI/types';
import { FilterQuery } from 'mongoose';
import { IHomeworkSubmission } from '@Models/Student/homeworkSubmitModel';
import { IStudentHomeworkRepository } from '@Interfaces/repository/IHomeworkStudentRepository';
import { IStudentHomeworkService } from '@Interfaces/services/IHomeworkStudentService';
import { HomeworkSubmissionDto } from '@dto/homeworkStudentDTO';
import logger from '@Utils/logger';
import { BadRequestError, FailureError, NotFoundError } from '@Middlewares/narrowDownErrors';

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

    if (!doc) {
      logger.error('[StudentHomeworkService:submitHomework] Failed to submit homework', {
        payload: dto,
      });

      throw new FailureError(HomeworkMessage.HomeworkNotUpdated);
    }

    return ApiResponse.success(doc, HomeworkMessage.HomeworkSubmitted);
  }

  // Get Single Submission
  async getSubmission(id: string): Promise<serviceReturnType> {
    const doc = await this._homeworkRepo.findSubmissionById(id);

    if (!doc) {
      logger.warn('[StudentHomeworkService:getSubmission] Submission not found', {
        submissionId: id,
      });

      throw new NotFoundError(HomeworkMessage.HomeworkNotFound);
    }

    return ApiResponse.success(doc, HomeworkMessage.HomeworkFetched);
  }

  // List Student Submissions
  async listStudentSubmissions(
    query: FilterQuery<Partial<IHomeworkSubmission>>,
  ): Promise<serviceReturnType> {
    const docs = await this._homeworkRepo.getStudentSubmissions(query);

    if (!docs || docs.length === 0) {
      logger.warn('[StudentHomeworkService:listStudentSubmissions] No submissions found', {
        query,
      });

      throw new NotFoundError(HomeworkMessage.HomeworkNotFound);
    }

    return ApiResponse.success(docs, HomeworkMessage.HomeworkListed);
  }

  // Get All Submissions
  async getallSubmission(
    query: FilterQuery<Partial<IHomeworkSubmission>>,
  ): Promise<serviceReturnType> {
    const docs = await this._homeworkRepo.getStudentSubmissions(query);

    if (!docs || docs.length === 0) {
      logger.warn('[StudentHomeworkService:getallSubmission] No homework submissions found', {
        query,
      });

      throw new NotFoundError(HomeworkMessage.HomeworkSubmissionNotFound);
    }

    return ApiResponse.success(docs, HomeworkMessage.HomeworkListed);
  }

  // Delete Submission
  async deleteSubmission(req: Request): Promise<serviceReturnType> {
    const { homeworkId } = req.params;

    if (!homeworkId) {
      logger.warn('[StudentHomeworkService:deleteSubmission] Homework ID missing');

      throw new NotFoundError(CommonMessage.IdNotFound);
    }

    const deleted = await this._homeworkRepo.deleteSubmission(homeworkId);

    if (!deleted) {
      logger.warn('[StudentHomeworkService:deleteSubmission] Submission not found during delete', {
        homeworkId,
      });

      throw new NotFoundError(HomeworkMessage.HomeworkNotFound);
    }

    return ApiResponse.success(null, HomeworkMessage.HomeworkDeleted);
  }

  // View Homework Details
  async viewHomework(req: Request): Promise<serviceReturnType> {
    const { homeworkId } = req.params;

    if (!homeworkId) {
      logger.warn('[StudentHomeworkService:viewHomework] Homework ID missing');

      throw new NotFoundError(CommonMessage.IdNotFound);
    }

    const doc = await this._homeworkRepo.findSubmissionById(homeworkId);

    if (!doc) {
      logger.warn('[StudentHomeworkService:viewHomework] Homework submission not found', {
        homeworkId,
      });

      throw new NotFoundError(HomeworkMessage.HomeworkNotFound);
    }

    return ApiResponse.success(doc, HomeworkMessage.HomeworkFetched);
  }

  // Update Submission
  async updateSubmission(req: Request): Promise<serviceReturnType> {
    const { homeworkId } = req.params;

    if (!homeworkId) {
      logger.warn('[StudentHomeworkService:updateSubmission] Homework ID missing');

      throw new NotFoundError(CommonMessage.IdNotFound);
    }

    const dto: Partial<IHomeworkSubmission> = HomeworkSubmissionDto.updateHomework(req);

    const updatedDoc = await this._homeworkRepo.updateSubmission(homeworkId, dto);

    if (!updatedDoc) {
      logger.warn('[StudentHomeworkService:updateSubmission] Failed to update submission', {
        homeworkId,
        payload: dto,
      });

      throw new BadRequestError(HomeworkMessage.HomeworkNotUpdated);
    }

    return ApiResponse.success(updatedDoc, HomeworkMessage.HomeworkUpdated);
  }

  // Update All Submission
  public async updateAllSubmission(req: Request): Promise<serviceReturnType> {
    const { homeworkId } = req.params;

    if (!homeworkId) {
      logger.warn('[StudentHomeworkService:updateAllSubmission] Homework ID missing');

      throw new NotFoundError(CommonMessage.IdNotFound);
    }

    const doc = await this._homeworkRepo.findSubmissionById(homeworkId);

    if (!doc) {
      logger.warn('[StudentHomeworkService:updateAllSubmission] Submission not found', {
        homeworkId,
      });

      throw new NotFoundError(HomeworkMessage.HomeworkNotFound);
    }

    return ApiResponse.success(doc, HomeworkMessage.HomeworkFetched);
  }
}
