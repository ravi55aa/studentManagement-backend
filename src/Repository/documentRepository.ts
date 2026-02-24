import { BaseRepository } from './BaseRepository';
import documentModel, { IDocument, IUploadedDoc } from '../Models/documentModel';
import { IDocumentRepository } from '../Interfaces/repository/IDocument.interface';
import { FilterQuery } from 'mongoose';
import { injectable } from 'tsyringe';
import logger from '../Utils/logger';

@injectable()
export class DocumentRepository extends BaseRepository<IDocument> implements IDocumentRepository {
  constructor() {
    super(documentModel);
  }

  //  Upload Document
  async uploadDocuments(data: Partial<IDocument>): Promise<IDocument | null> {
    try {
      return await this.create(data);
    } catch (error) {
      logger.error('Error uploading document:', error);
      return null;
    }
  }

  //  Replace Entire Document Data
  async updateDocuments(
    query: FilterQuery<Partial<IDocument>>,
    data: IUploadedDoc[],
  ): Promise<IDocument | null> {
    try {
      if (!query || Object.keys(query).length === 0) {
        return null;
      }

      return await this.model
        .findOneAndUpdate(
          query,
          { $set: { docs: data } },
          {
            new: true,
            runValidators: true,
          },
        )
        .lean<IDocument>();
    } catch (error) {
      logger.error('Error updating document:', error);
      return null;
    }
  }

  //  Push New Documents (Append Mode)
  async updateNEWUploadDocuments(
    query: FilterQuery<Partial<IDocument>>,
    data: IUploadedDoc[],
  ): Promise<IDocument | null> {
    try {
      if (!query || Object.keys(query).length === 0) {
        return null;
      }

      return await this.model
        .findOneAndUpdate(
          query,
          { $push: { docs: { $each: data } } },
          {
            new: true,
            upsert: false,
          },
        )
        .lean<IDocument>();
    } catch (error) {
      logger.error('Error appending document:', error);
      return null;
    }
  }

  //  Delete Entire Document
  async deleteDocument(query: FilterQuery<Partial<IDocument>>): Promise<boolean> {
    try {
      if (!query || Object.keys(query).length === 0) {
        return false;
      }

      const result = await this.model.deleteOne(query);
      return result.deletedCount === 1;
    } catch (error) {
      logger.error('Error deleting document:', error);
      return false;
    }
  }

  //  Delete Single File From Document
  async deleteADocumentFile(
    filter: FilterQuery<Partial<IDocument>>,
    pullQuery: Partial<IDocument>,
  ): Promise<boolean> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        return false;
      }

      const result = await this.model.updateOne(filter, { $pull: pullQuery });

      return result.modifiedCount === 1;
    } catch (error) {
      logger.error('Error removing document file:', error);
      return false;
    }
  }
}
