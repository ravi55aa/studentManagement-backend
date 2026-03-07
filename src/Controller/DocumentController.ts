import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';

import { DocumentsDto } from '../dto/schoolDTO';
import { IDocumentService } from '../Interfaces/services/IDocument.service';
import { TYPES } from '../DI/types';

@injectable()
export class DocumentController {
  constructor(
    @inject(TYPES.DocumentService)
    private _documentService: IDocumentService,
  ) {}

  public async addNewDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = DocumentsDto.handleDtoOfDoc(req, res);

      const { status, resBody } = await this._documentService.uploadDocs(dto);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  public async updateDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, resBody } = await this._documentService.updateDocs(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  //1x Single File
  public async deleteDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, resBody } = await this._documentService.deleteDocument(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  //2x Multiples files
  public async deleteADocumentFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, resBody } = await this._documentService.deleteAFile(req);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  public async uploadAdditionDocuments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { status, resBody } = await this._documentService.update_NewAddition_Documents(
        req,
        res,
      );

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }
}
