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
import logger from '@Utils/logger';
import { InternalServerError } from '@Middlewares/narrowDownErrors';

@injectable()
export class StudentHomeworkService implements IStudentHomeworkService {
  constructor(
    @inject(TYPES.StudentHomeworkRepository)
    private _homeworkRepo: IStudentHomeworkRepository,
  ) {}

  // Submit Homework
  async submitHomework(req: Request, res: Response): Promise<serviceReturnType> {

    try{
      const dto: Partial<IHomeworkSubmission> = HomeworkSubmissionDto.submitHomework(req, res);
  
      const doc = await this._homeworkRepo.submitHomework(dto);
  
      return ApiResponse.success(doc, HomeworkMessage.HomeworkSubmitted);
    } catch(error){
      logger.error(HomeworkMessage.HomeworkNotUpdated, error);
      throw new InternalServerError();
    }
  }

  // Get Single Submission
  //studentSubmissionId
  async getSubmission(id: string): Promise<serviceReturnType> {
    try{
      const doc = await this._homeworkRepo.findSubmissionById(id);
  
      if (!doc) {
        return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
      }
  
      return ApiResponse.success(doc, HomeworkMessage.HomeworkFetched);
    } catch(error){ 
      logger.error(HomeworkMessage.HomeworkNotFound, error);
      throw new InternalServerError();
    }
  }

  // List Student Submissions
  async listStudentSubmissions(
    query: FilterQuery<Partial<IHomeworkSubmission>>,
  ): Promise<serviceReturnType> {
    try{
      const docs = await this._homeworkRepo.getStudentSubmissions(query);
  
      if (!docs || docs.length === 0) {
        return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
      }
  
      return ApiResponse.success(docs, HomeworkMessage.HomeworkListed);
    } catch(error){
      logger.error(HomeworkMessage.HomeworkNotFound, error);
      throw new InternalServerError();
    }
  }

  async getallSubmission(
    query: FilterQuery<Partial<IHomeworkSubmission>>,
  ): Promise<serviceReturnType> {
    try{
      const docs = await this._homeworkRepo.getStudentSubmissions(query);

      if (!docs || docs.length === 0) {
        return ApiResponse.failure(HomeworkMessage.HomeworkSubmissionNotFound);
      }
      return ApiResponse.success(docs, HomeworkMessage.HomeworkListed);
    } catch(error){
      logger.error(HomeworkMessage.HomeworkNotFound, error);
      throw new InternalServerError();
    }
  }

  // Delete Submission
  async deleteSubmission(req: Request): Promise<serviceReturnType> {
    try{
      const { homeworkId } = req.params;
  
      const deleted = await this._homeworkRepo.deleteSubmission(homeworkId!);
  
      if (!deleted) {
        return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
      }
  
      return ApiResponse.success(null, HomeworkMessage.HomeworkDeleted);
    } catch(error){
      logger.error(HomeworkMessage.HomeworkNotFound, error);
      throw new InternalServerError();
    }
  }

  // View Homework Details
  async viewHomework(req: Request): Promise<serviceReturnType> {
    try{
      const { homeworkId } = req.params;
  
      const doc = await this._homeworkRepo.findSubmissionById(homeworkId!);
  
      if (!doc) {
        return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
      }
  
      return ApiResponse.success(doc, HomeworkMessage.HomeworkFetched);
    } catch(error){
      logger.error(HomeworkMessage.HomeworkNotFound, error);
      throw new InternalServerError();
    }
  }

  // Update Submission (Resubmit)
  async updateSubmission(req: Request): Promise<serviceReturnType> {
    try{
      const { homeworkId } = req.params;
  
      const dto: Partial<IHomeworkSubmission> = HomeworkSubmissionDto.updateHomework(req);
  
      const updatedDoc = await this._homeworkRepo.updateSubmission(homeworkId!, dto);
  
      if (!updatedDoc) {
        return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
      }
  
      return ApiResponse.success(updatedDoc, HomeworkMessage.HomeworkUpdated);
    } catch(error){
      logger.error(HomeworkMessage.HomeworkNotUpdated, error);
      throw new InternalServerError();
    }
  }

  public async updateAllSubmission(req: Request): Promise<serviceReturnType> {
    try{
      const { homeworkId } = req.params;
  
      const doc = await this._homeworkRepo.findSubmissionById(homeworkId!);
  
      if (!doc) {
        return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
      }
  
      return ApiResponse.success(doc, HomeworkMessage.HomeworkFetched);
    } catch(error){
      logger.error(HomeworkMessage.HomeworkNotFound, error);
      throw new InternalServerError();
    }
  }
}
