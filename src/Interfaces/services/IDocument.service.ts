import { serviceReturnType } from '../../Constants/interfaces';
import { IDocument } from '../../Models/documentModel';
import { Request, Response } from 'express';

export interface IDocumentService {
  uploadDocs(data: Partial<IDocument>): Promise<serviceReturnType>;

  updateDocs(req: Request, res: Response): Promise<serviceReturnType>;

  deleteDocument(req: Request, res: Response): Promise<serviceReturnType>;

  deleteAFile(req: Request, res: Response): Promise<serviceReturnType>;

  update_NewAddition_Documents(req: Request, res: Response): Promise<serviceReturnType>;
}
