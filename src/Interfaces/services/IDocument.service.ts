import { Request, Response } from 'express';

import { serviceReturnType } from '../../Constants/interfaces';
import { IDocument } from '../../Models/documentModel';

export interface IDocumentService {
  uploadDocs(data: Partial<IDocument>): Promise<serviceReturnType>;

  updateDocs(req: Request, res: Response): Promise<serviceReturnType>;

  deleteDocument(req: Request, res: Response): Promise<serviceReturnType>;

  deleteAFile(req: Request): Promise<serviceReturnType>;

  update_NewAddition_Documents(req: Request,res:Response): Promise<serviceReturnType>;
}
