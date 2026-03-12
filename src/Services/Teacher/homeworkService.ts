import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { ApiResponse } from '@Constants/apiResponse';
import { serviceReturnType } from '@Constants/interfaces';
import { HomeworkMessage } from '@Constants/resposeMessages';
import { IHomework } from '@Interfaces/model/Teacher/IHomework';
import { IHomeworkService } from '@Interfaces/services/IHomeworkService';
import { TYPES } from '@DI/types';
import { IHomeworkRepository } from '@Interfaces/repository/IHomeworkRepository';
import { HomeWorkDto } from '@dto/homeworkDto';
import { FilterQuery } from 'mongoose';

@injectable()
export class HomeworkService implements IHomeworkService {
    constructor(
        @inject(TYPES.HomeworkRepository)
        private _homeworkRepo: IHomeworkRepository,
    ) {}

    async createHomework(req: Request, res: Response): Promise<serviceReturnType> {
        const dto: Partial<IHomework> = HomeWorkDto.createHomework(req,res);

        //const validation=handleValidationOF(HomeworkSchema,dto,res);

        const doc = await this._homeworkRepo.createHomework(dto);

        return ApiResponse.success(doc, HomeworkMessage.HomeworkCreated);
    }

    async getHomework(id:string): Promise<serviceReturnType> {

        const doc = await this._homeworkRepo.findById(id!);

        if (!doc) {
        return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
        }

        return ApiResponse.success(doc, HomeworkMessage.HomeworkFetched);
    }

    async listAllHomework(query:FilterQuery<Partial<IHomework>>): Promise<serviceReturnType> {
        const docs = await this._homeworkRepo.getAllHomework(query);

        if (!docs || docs.length === 0) {
        return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
        }

        return ApiResponse.success(docs, HomeworkMessage.HomeworkListed);
    }

    async updateHomework(req: Request, res: Response): Promise<serviceReturnType> {
        const { id } = req.params;

        const dto: Partial<IHomework> = HomeWorkDto.createHomework(req,res);

        const updatedDoc = await this._homeworkRepo.updateHomework(id!, dto);

        if (!updatedDoc) {
        return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
        }

        return ApiResponse.success(updatedDoc, HomeworkMessage.HomeworkUpdated);
    }

    async deleteHomework(req: Request): Promise<serviceReturnType> {
        const { id } = req.params;

        const deleted = await this._homeworkRepo.deleteHomework(id!);

        if (!deleted) {
        return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
        }

        return ApiResponse.success(null, HomeworkMessage.HomeworkDeleted);
    }

    async viewHomework(req: Request): Promise<serviceReturnType> {
        const { id } = req.params;

        const doc = await this._homeworkRepo.findById(id!);

        if (!doc) {
        return ApiResponse.failure(HomeworkMessage.HomeworkNotFound);
        }

        return ApiResponse.success(doc, HomeworkMessage.HomeworkFetched);
    }
}
