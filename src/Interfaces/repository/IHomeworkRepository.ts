import { FilterQuery } from "mongoose";
import { IHomework } from "@Interfaces/model/Teacher/IHomework";

export interface IHomeworkRepository {
    createHomework(data: Partial<IHomework>): Promise<IHomework | null>;

    findById(id: string): Promise<IHomework | null>;

    getAllHomework(query:FilterQuery<Partial<IHomework>>): Promise<IHomework[]>;

    updateHomework(id: string, data: Partial<IHomework>): Promise<IHomework | null>;

    deleteHomework(id: string): Promise<boolean>;
}