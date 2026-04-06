import { Request, Response } from 'express';
import { IHomework } from '@Interfaces/model/Teacher/IHomework';
import { handleTokenVerification } from '@Utils/jwt';
import { IUploadedDoc } from '@Models/documentModel';

export class HomeWorkDto {
  static createHomework(req: Request, res: Response) {
    const { batchId, title, description, subjectId, status, dueDate }: IHomework = req.body;

    const files = req.files as Express.Multer.File[];

    const docs = files?.map((f) => ({
      url: f.path,
      fileName: f.filename,
    }));

      let existingDocs: IUploadedDoc[] = [];

      if (req.body.existingAttachments) {
        existingDocs = Array.isArray(req.body.existingAttachments)
          ? req.body.existingAttachments.map((d:string) => JSON.parse(d))
          : [JSON.parse(req.body.existingAttachments)];
      }

    const decodedToken = handleTokenVerification(req, res);

    const homeworkDto: Partial<IHomework> = {
      title,
      description,
      subjectId,
      status,
      dueDate,
      attachments: [...docs,...existingDocs],
      teacherId: decodedToken.userId!,
      batchId: batchId,
    };

    return homeworkDto;
  }
}
