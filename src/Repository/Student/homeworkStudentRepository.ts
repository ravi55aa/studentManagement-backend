import { injectable } from "tsyringe";
import { FilterQuery, Types } from "mongoose";
import { BaseRepository } from "@Repository/BaseRepository";
import logger from "@Utils/logger"; 
import { IStudentHomeworkRepository } from "@Interfaces/repository/IHomeworkStudentRepository";
import {
    homeworkSubmissionModel,
    IHomeworkSubmission
} from "@Models/Student/homeworkSubmitModel";

@injectable()
export class StudentHomeworkRepository
    extends BaseRepository<IHomeworkSubmission>
    implements IStudentHomeworkRepository {

    constructor() {
        super(homeworkSubmissionModel);
    }

    // Submit homework
    async submitHomework(
        data: Partial<IHomeworkSubmission>
    ): Promise<IHomeworkSubmission | null> {
        try {
        return await this.create(data);
        } catch (error) {
        logger.error("Error while submitting homework:", error);
        return null;
        }
    }

    // Find submission by id
    async findSubmissionById(
        id: string
    ): Promise<IHomeworkSubmission | null> {
        try {
        return await super.findById(id);
        } catch (error) {
        logger.error("Error while finding submission by id:", error);
        return null;
        }
    }

    // Get student submissions
    async getStudentSubmissions(
        query: FilterQuery<Partial<IHomeworkSubmission>>
    ): Promise<IHomeworkSubmission[]> {
        try {
        const submissions = await this.model
            .find({ ...query, isDelete: false })
            .populate("homeworkId")
            .lean<IHomeworkSubmission[]>();

        logger.info("query", query, "submissions", submissions);

        return submissions;
        } catch (error) {
        logger.error("Error while fetching submissions:", error);
        return [];
        }
    }

    // Update submission
    async updateSubmission(
        id: string,
        updateData: Partial<IHomeworkSubmission>
    ): Promise<IHomeworkSubmission | null> {
        try {
        return await this.updateById(id, updateData);
        } catch (error) {
        logger.error("Error while updating submission:", error);
        return null;
        }
    }

    // Soft delete submission
    async deleteSubmission(id: string): Promise<boolean> {
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
        logger.error("Error while deleting submission:", error);
        return false;
        }
    }
}