import { injectable } from "tsyringe";
import { Types } from "mongoose";
import { IHomework } from "@Interfaces/model/Teacher/IHomework";
import { IHomeworkRepository } from "@Interfaces/repository/IHomeworkRepository";
import { HomeworkModel } from "@Models/Teacher/homework.model";
import { BaseRepository } from "@Repository/BaseRepository";
import logger from "@Utils/logger";


@injectable()
export class HomeworkRepository
    extends BaseRepository<IHomework>
    implements IHomeworkRepository
    {
    constructor() {
        super(HomeworkModel);
    }

    async createHomework(homeworkData: Partial<IHomework>): Promise<IHomework | null> {
        try {
        return await this.create(homeworkData);
        } catch (error) {
        logger.error("Error while creating homework:", error);
        return null;
        }
    }

    async findById(id: string): Promise<IHomework | null> {
        try {
        return await this.findById(id);
        } catch (error) {
        logger.error("Error while finding homework by id:", error);
        return null;
        }
    }

    async getAllHomework(): Promise<IHomework[]> {
        try {
        return await this.findMany({ isDelete: false });
        } catch (error) {
        logger.error("Error while fetching homework list:", error);
        return [];
        }
    }

    async updateHomework(
        id: string,
        updateData: Partial<IHomework>
    ): Promise<IHomework | null> {
        try {
        return await this.updateById(id, updateData);
        } catch (error) {
        logger.error("Error while updating homework:", error);
        return null;
        }
    }

    async deleteHomework(id: string): Promise<boolean> {
        try {
        if (!Types.ObjectId.isValid(id)) {
            return false;
        }

        const result = await this.model.updateOne(
            { _id: id },
            { $set: { isDelete: true } }
        );

        return result.modifiedCount === 1;
        } catch (error) {
        logger.error("Error while deleting homework:", error);
        return false;
        }
    }
}