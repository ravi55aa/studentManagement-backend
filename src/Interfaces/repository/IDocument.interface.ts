import { FilterQuery } from 'mongoose';
import { IDocument, IUploadedDoc } from '../../Models/documentModel';
import { BaseRepository } from '../../Repository/BaseRepository';

export interface IDocumentRepository extends BaseRepository<IDocument> {
  uploadDocuments(data: Partial<IDocument>): Promise<IDocument | null>;

  updateDocuments(
    query: FilterQuery<Partial<IDocument>>,
    data: IUploadedDoc[],
  ): Promise<Partial<IDocument> | null>;

  updateNEWUploadDocuments(
    query: FilterQuery<Partial<IDocument>>,
    data: IUploadedDoc[],
  ): Promise<Partial<IDocument> | null>;

  deleteDocument(query: FilterQuery<Partial<IDocument>>): Promise<boolean>;

  deleteADocumentFile(
    filter: FilterQuery<Partial<IDocument>>,
    pullQuery: Partial<IDocument>,
  ): Promise<boolean>;
}
