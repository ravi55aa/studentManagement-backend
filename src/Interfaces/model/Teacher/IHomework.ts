import { Types,Document } from "mongoose";
import { HomeWorkStatus } from "types/homework";
import { IUploadedDoc } from "Models/documentModel";


export interface IHomework extends Document{
    title: string;
    description: string;
    attachments?: IUploadedDoc[];
    
    subjectId: Types.ObjectId;
    batchId: Types.ObjectId;
    teacherId: Types.ObjectId;
    
    status:HomeWorkStatus
    dueDate: Date;
    isDelete:boolean

    createdAt?: Date;
    updatedAt?: Date;
}