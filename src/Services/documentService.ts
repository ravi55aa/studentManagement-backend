import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { StatusCodes } from '@Constants/statusCodes';
import { FailureError } from '@Middlewares/narrowDownErrors';
import { TYPES } from '@DI/types';
import { serviceReturnType } from '@Constants/interfaces';
import { IDocumentService } from '@Interfaces/services/IDocument.service';
import { IDocument } from '@Models/documentModel';
import { ApiResponse } from '@Constants/apiResponse';
import { CommonMessage, DocumentMessage } from '@Constants/resposeMessages';
import logger from '@Utils/logger';
import { IDocumentRepository } from '@Interfaces/repository/IDocument.interface';

import { DocumentsDto } from '../dto/schoolDTO';

@injectable()
export class DocumentService implements IDocumentService {
  constructor(
    @inject(TYPES.DocumentRepository)
    private _documentRepository: IDocumentRepository,
  ) {}

  // Get Documents
  async getDocs(userId: string): Promise<serviceReturnType> {
    if (!userId) {
      logger.warn('[DocumentService:getDocs] User ID missing');

      throw new FailureError(CommonMessage.IdNotFound);
    }

    const documents = await this._documentRepository.getDocumentsOf(userId);

    if (!documents) {
      logger.warn('[DocumentService:getDocs] Documents not found', {
        userId,
      });

      throw new FailureError(DocumentMessage.DocumentNotFound);
    }

    return ApiResponse.success(documents, DocumentMessage.DocumentFetched);
  }

  // Upload Documents
  async uploadDocs(data: Partial<IDocument>): Promise<serviceReturnType> {
    const uploaded = await this._documentRepository.uploadDocuments(data);

    if (!uploaded) {
      logger.error('[DocumentService:uploadDocs] Failed to upload documents', {
        payload: data,
      });

      throw new FailureError(DocumentMessage.DocumentUploadFailed);
    }

    return ApiResponse.success(uploaded, DocumentMessage.DocumentUploaded);
  }

  // Update Documents
  async updateDocs(req: Request, res: Response): Promise<serviceReturnType> {
    const { dtoData, dtoQuery } = DocumentsDto.updateDoc(req, res);

    const updated = await this._documentRepository.updateDocuments(dtoQuery, dtoData);

    if (!updated) {
      logger.warn('[DocumentService:updateDocs] Document not found during update', {
        dtoQuery,
        dtoData,
      });

      throw new FailureError(DocumentMessage.DocumentNotFound);
    }

    return ApiResponse.success(updated, DocumentMessage.DocumentUpdated);
  }

  // Update Additional Documents
  async update_NewAddition_Documents(req: Request, res: Response): Promise<serviceReturnType> {
    const { dtoData, dtoQuery } = DocumentsDto.updateDocV2(req, res);

    const isDocument = await this._documentRepository.findOne(dtoQuery);

    // Create new document if not exists
    if (!isDocument) {
      logger.warn(
        '[DocumentService:update_NewAddition_Documents] Document not found, creating new upload',
        {
          dtoQuery,
        },
      );

      const data = DocumentsDto.handleDtoOfDoc(req, res);

      const newUpload = await this.uploadDocs(data);

      return newUpload.status === StatusCodes.OK
        ? newUpload
        : ApiResponse.failure(DocumentMessage.DocumentUpdateFailed);
    }

    const updated = await this._documentRepository.updateNEWUploadDocuments(dtoQuery, dtoData);

    if (!updated) {
      logger.error(
        '[DocumentService:update_NewAddition_Documents] Failed to update additional documents',
        {
          dtoQuery,
          dtoData,
        },
      );

      throw new FailureError(DocumentMessage.DocumentUpdateFailed);
    }

    return ApiResponse.success(updated, DocumentMessage.DocumentUpdated);
  }

  // Delete Entire Document
  async deleteDocument(req: Request, res: Response): Promise<serviceReturnType> {
    const query = DocumentsDto.deleteDoc(req, res);

    const deleted = await this._documentRepository.deleteDocument(query);

    if (!deleted) {
      logger.warn('[DocumentService:deleteDocument] Document not found during delete', {
        query,
      });

      throw new FailureError(DocumentMessage.DocumentNotFound);
    }

    return ApiResponse.success(null, DocumentMessage.DocumentDeleted);
  }

  // Delete Single File
  async deleteAFile(req: Request): Promise<serviceReturnType> {
    const { filterQuery, pullQuery } = DocumentsDto.removeOneDocument(req);

    const deleted = await this._documentRepository.deleteADocumentFile(filterQuery, pullQuery);

    if (!deleted) {
      logger.warn('[DocumentService:deleteAFile] File not found during delete', {
        filterQuery,
        pullQuery,
      });

      throw new FailureError(DocumentMessage.FileNotFound);
    }

    return ApiResponse.success(null, DocumentMessage.FileDeleted);
  }
}
