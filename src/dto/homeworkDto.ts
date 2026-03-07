import { Request, Response } from 'express';

import { IHomework } from '../Interfaces/model/Teacher/IHomework'; 
import { handleTokenVerification } from '../Utils/jwt';

export class HomeWorkDto {
    static createHomework(req:Request, res: Response) {
        const { attachments,batchId }:IHomework =
        req.body;

        const decodedToken = handleTokenVerification(req, res);

        const homeworkDto: Partial<IHomework> = {
            attachments:attachments!,
            teacherId:decodedToken.userId!,
            batchId:batchId
        };

        return homeworkDto;
    }
}
