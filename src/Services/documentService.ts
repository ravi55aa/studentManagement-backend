import { serviceReturnType } from '../Constants/interfaces';
import { IDocumentService } from '../Interfaces/services/IDocument.service';
import { IDocument } from '../Models/documentModel';
import { Request, Response } from 'express';
import { DocumentsDto } from '../dto/schoolDTO';
import { inject, injectable } from 'tsyringe';
import { DocumentRepository } from '../Repository/documentRepository';
import { ApiResponse } from '../Constants/apiResponse';
import { DocumentMessage } from '../Constants/resposeMessages';
import logger from '../Utils/logger';

@injectable()
export class DocumentService implements IDocumentService {
  constructor(
    @inject(DocumentRepository)
    private documentRepository: DocumentRepository,
  ) {}

  //  Upload Documents
  async uploadDocs(data: Partial<IDocument>): Promise<serviceReturnType> {
    try {
      const uploaded = await this.documentRepository.uploadDocuments(data);

      if (!uploaded) {
        return ApiResponse.failure(DocumentMessage.DocumentUploadFailed);
      }

      return ApiResponse.success(uploaded, DocumentMessage.DocumentUploaded);
    } catch (error) {
      logger.error('Error uploading document:', error);
      return ApiResponse.failure('Internal server error');
    }
  }

  // Update Document
  async updateDocs(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const { dtoData, dtoQuery } = DocumentsDto.updateDoc(req, res);

      const updated = await this.documentRepository.updateDocuments(dtoQuery, dtoData);

      if (!updated) {
        return ApiResponse.notFound(DocumentMessage.DocumentNotFound);
      }

      return ApiResponse.success(updated, DocumentMessage.DocumentUpdated);
    } catch (error) {
      logger.error('Error updating document:', error);
      return ApiResponse.failure('Internal server error');
    }
  }

  //  Update New Addition Documents
  async update_NewAddition_Documents(req: Request,res:Response): Promise<serviceReturnType> {
    try {
      const { dtoData, dtoQuery } = DocumentsDto.updateDocV2(req,res);

      const updated = await this.documentRepository.updateNEWUploadDocuments(dtoQuery, dtoData);

      if (!updated) {
        return ApiResponse.notFound(DocumentMessage.DocumentNotFound);
      }

      return ApiResponse.success(updated, DocumentMessage.DocumentUpdated);
    } catch (error) {
      logger.error('Error updating additional documents:', error);
      return ApiResponse.failure('Internal server error');
    }
  }

  //  Delete Entire Document
  async deleteDocument(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const query = DocumentsDto.deleteDoc(req, res);

      const deleted = await this.documentRepository.deleteDocument(query);

      if (!deleted) {
        return ApiResponse.notFound(DocumentMessage.DocumentNotFound);
      }

      return ApiResponse.success(null, DocumentMessage.DocumentDeleted);
    } catch (error) {
      logger.error('Error deleting document:', error);
      return ApiResponse.failure('Internal server error');
    }
  }

  //  Delete Single File From Document
  async deleteAFile(req: Request): Promise<serviceReturnType> {
    try {
      const { filterQuery, pullQuery } = DocumentsDto.removeOneDocument(req);

      const deleted = await this.documentRepository.deleteADocumentFile(filterQuery, pullQuery);

      if (!deleted) {
        return ApiResponse.notFound(DocumentMessage.FileNotFound);
      }

      return ApiResponse.success(null, DocumentMessage.FileDeleted);
    } catch (error) {
      logger.error('Error deleting document file:', error);
      return ApiResponse.failure('Internal server error');
    }
  }
}
