import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { StatusCodes } from '@Constants/statusCodes';

import { TYPES } from '../DI/types';
import { serviceReturnType } from '../Constants/interfaces';
import { IDocumentService } from '../Interfaces/services/IDocument.service';
import { IDocument } from '../Models/documentModel';
import { DocumentsDto } from '../dto/schoolDTO';
import { ApiResponse } from '../Constants/apiResponse';
import { CommonMessage, DocumentMessage, ServerMessage } from '../Constants/resposeMessages';
import logger from '../Utils/logger';
import { IDocumentRepository } from '../Interfaces/repository/IDocument.interface';

@injectable()
export class DocumentService implements IDocumentService {
  constructor(
    @inject(TYPES.DocumentRepository)
    private _documentRepository: IDocumentRepository,
  ) {}

  //  Upload Documents
  async getDocs(userId: string): Promise<serviceReturnType> {
    try {
      if (!userId) {
        return ApiResponse.badRequest(CommonMessage.IdNotFound);
      }
      const documents = await this._documentRepository.getDocumentsOf(userId);

      if (!documents) {
        return ApiResponse.success(DocumentMessage.DocumentNotFound);
      }

      return ApiResponse.success(documents, DocumentMessage.DocumentFetched);
    } catch (error) {
      logger.error('Error uploading document:', error);
      return ApiResponse.internalServerError(ServerMessage.ServerError);
    }
  }

  async uploadDocs(data: Partial<IDocument>): Promise<serviceReturnType> {
    try {
      const uploaded = await this._documentRepository.uploadDocuments(data);

      if (!uploaded) {
        return ApiResponse.failure(DocumentMessage.DocumentUploadFailed);
      }

      return ApiResponse.success(uploaded, DocumentMessage.DocumentUploaded);
    } catch (error) {
      logger.error('Error uploading document:', error);
      return ApiResponse.internalServerError(ServerMessage.ServerError);
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
      return ApiResponse.internalServerError(ServerMessage.ServerError);
    }
  }

  //  Update New Addition Documents
  async update_NewAddition_Documents(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const { dtoData, dtoQuery } = DocumentsDto.updateDocV2(req, res);

      //find the document first,
      const isDocument=await this._documentRepository.findOne(dtoQuery);

      if(!isDocument || isDocument===null){
        const data=DocumentsDto.handleDtoOfDoc(req,res);
        
        const newUpload=await this.uploadDocs(data);

        return newUpload.status==StatusCodes.OK 
        ?  newUpload 
        :  ApiResponse.failure(DocumentMessage.DocumentUpdateFailed);
      }

      const updated = await this._documentRepository.updateNEWUploadDocuments(dtoQuery, dtoData);


      if (!updated) {
        return ApiResponse.failure(DocumentMessage.DocumentUpdateFailed);
      }

      return ApiResponse.success(updated, DocumentMessage.DocumentUpdated);
    } catch (error) {
      logger.error('Error updating additional documents:', error);
      return ApiResponse.internalServerError(ServerMessage.ServerError);
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
      return ApiResponse.internalServerError(ServerMessage.ServerError);
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
      return ApiResponse.internalServerError(ServerMessage.ServerError);
    }
  }
}
