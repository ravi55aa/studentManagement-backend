import { Types,Document } from "mongoose";
import { HomeWorkStatus } from "types/homework";
import { uploadedDocSchema } from "Models/documentModel";


export interface IHomework extends Document{
    title: string;
    description: string;
    attachments?: typeof uploadedDocSchema[];
    
    subjectId: Types.ObjectId;
    batchId: Types.ObjectId;
    teacherId: Types.ObjectId;
    
    status:HomeWorkStatus
    dueDate: Date;
    isDelete:boolean

    createdAt?: Date;
    updatedAt?: Date;
}