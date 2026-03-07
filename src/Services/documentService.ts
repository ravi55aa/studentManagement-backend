import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { TYPES } from '../DI/types';
import { serviceReturnType } from '../Constants/interfaces';
import { IDocumentService } from '../Interfaces/services/IDocument.service';
import { IDocument } from '../Models/documentModel';
import { DocumentsDto } from '../dto/schoolDTO';
import { ApiResponse } from '../Constants/apiResponse';
import { DocumentMessage, ServerMessage } from '../Constants/resposeMessages';
import logger from '../Utils/logger';
import { IDocumentRepository } from '../Interfaces/repository/IDocument.interface';

@injectable()
export class DocumentService implements IDocumentService {
  constructor(
    @inject(TYPES.DocumentRepository)
    private _documentRepository: IDocumentRepository,
  ) {}

  //  Upload Documents
  async uploadDocs(data: Partial<IDocument>): Promise<serviceReturnType> {
    try {
      const uploaded = await this._documentRepository.uploadDocuments(data);

      if (!uploaded) {
        return ApiResponse.failure(DocumentMessage.DocumentUploadFailed);
      }

      return ApiResponse.success(uploaded, DocumentMessage.DocumentUploaded);
    } catch (error) {
      logger.error('Error uploading document:', error);
      return  ApiResponse.internalServerError(ServerMessage.ServerError)
    }
  }

  // Update Document
  async updateDocs(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const { dtoData, dtoQuery } = DocumentsDto.updateDoc(req, res);

      const updated = await this._documentRepository.updateDocuments(dtoQuery, dtoData);

      if (!updated) {
        return ApiResponse.notFound(DocumentMessage.DocumentNotFound);
      }

      return ApiResponse.success(updated, DocumentMessage.DocumentUpdated);
    } catch (error) {
      logger.error('Error updating document:', error);
      return  ApiResponse.internalServerError(ServerMessage.ServerError)
    }
  }

  //  Update New Addition Documents
  async update_NewAddition_Documents(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const { dtoData, dtoQuery } = DocumentsDto.updateDocV2(req, res);

      const updated = await this._documentRepository.updateNEWUploadDocuments(dtoQuery, dtoData);

      if (!updated) {
        return ApiResponse.notFound(DocumentMessage.DocumentNotFound);
      }

      return ApiResponse.success(updated, DocumentMessage.DocumentUpdated);
    } catch (error) {
      logger.error('Error updating additional documents:', error);
      return  ApiResponse.internalServerError(ServerMessage.ServerError)
    }
  }

  //  Delete Entire Document
  async deleteDocument(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const query = DocumentsDto.deleteDoc(req, res);

      const deleted = await this._documentRepository.deleteDocument(query);

      if (!deleted) {
        return ApiResponse.notFound(DocumentMessage.DocumentNotFound);
      }

      return ApiResponse.success(null, DocumentMessage.DocumentDeleted);
    } catch (error) {
      logger.error('Error deleting document:', error);
      return  ApiResponse.internalServerError(ServerMessage.ServerError)
    }
  }

  //  Delete Single File From Document
  async deleteAFile(req: Request): Promise<serviceReturnType> {
    try {
      const { filterQuery, pullQuery } = DocumentsDto.removeOneDocument(req);

      const deleted = await this._documentRepository.deleteADocumentFile(filterQuery, pullQuery);

      if (!deleted) {
        return ApiResponse.notFound(DocumentMessage.FileNotFound);
      }

      return ApiResponse.success(null, DocumentMessage.FileDeleted);
    } catch (error) {
      logger.error('Error deleting document file:', error);
      return  ApiResponse.internalServerError(ServerMessage.ServerError)
    }
  }
}
