import { Request, Response } from 'express';
import { IHomework } from '@Interfaces/model/Teacher/IHomework'; 
import { handleTokenVerification } from '@Utils/jwt';

export class HomeWorkDto {
    static createHomework(req:Request, res: Response) {
        const {
            batchId,
            title,
            description,    
            subjectId,
            status,
            dueDate 
        }:IHomework = req.body;

        const files=req.files as Express.Multer.File[];
        
        const docs = files?.map((f) => ({
            url: f.path,
            fileName: f.filename,
        }));

        const decodedToken = handleTokenVerification(req, res);

        const homeworkDto: Partial<IHomework> = {
            title,
            description,    
            subjectId,
            status,
            dueDate,
            attachments:[...docs],
            teacherId:decodedToken.userId!,
            batchId:batchId
        };

        return homeworkDto;
    }
}
