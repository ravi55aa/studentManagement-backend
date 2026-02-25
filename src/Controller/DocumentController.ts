import { Request, Response, NextFunction } from 'express';
import { DocumentsDto } from '../dto/schoolDTO';
import { injectable, inject } from 'tsyringe';
import { DocumentService } from '../Services/documentService';
import { IDocumentService } from '../Interfaces/services/IDocument.service';

@injectable()
export class DocumentController {
  constructor(
    @inject(DocumentService)
    private documentService: IDocumentService,
  ) {}

  public async addNewDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = DocumentsDto.handleDtoOfDoc(req,res);

      const {status,resBody} = await this.documentService.uploadDocs(dto);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  public async updateDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, resBody } = await this.documentService.updateDocs(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  //Plural
  public async deleteDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, resBody } = await this.documentService.deleteDocument(req, res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }

  //Singular
  public async deleteADocumentFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, resBody } = await this.documentService.deleteAFile(req);

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
      const { status, resBody } = await this.documentService.update_NewAddition_Documents(req,res);

      res.status(status).json(resBody);
    } catch (err) {
      next(err);
    }
  }
}
