import { BaseRepository } from "./BaseRepository";
import documentModel ,{ IDocument, IUploadedDoc } from "../Models/documentModel";
import { IDocumentRepository } from "../Interfaces/repository/IDocument.interface";
import { FilterQuery } from "mongoose";
import { injectable } from "tsyringe";



@injectable()
export class DocumentRepository
        extends BaseRepository<IDocument> 
                implements IDocumentRepository
    
    {

        constructor()
        {
            super(documentModel);
        }


        public async uploadDocuments(data: Partial<IDocument>) 
        : Promise<IDocument|null> 
        {
            const newDoc=new documentModel(data); 
            await newDoc.save();
            return newDoc;
        }


        public async updateDocuments(query:FilterQuery<Partial<IDocument>>,data:IUploadedDoc[]) 
        : Promise<Partial<IDocument>|null> 
        {
            try{
            return await documentModel.findOneAndUpdate(
                query,
                { $set: data },
                {
                new: true,
                runValidators: true
                }
            )
            .lean<IDocument>();
            } catch (error) {
                throw new Error("Failed to update document:" ,{cause :error} );
            }
        }

        public async updateNEWUploadDocuments(query:FilterQuery<Partial<IDocument>>,data:IUploadedDoc[]) 
        : Promise<Partial<IDocument>|null> 
        {
            try{
            return await documentModel.findOneAndUpdate(
                query,
                    { $push: 
                        { docs:{$each :data} } 
                    },
                {
                    upsert:true
                }
            )
            .lean<IDocument>();
            } catch (error) {
                throw new Error("Failed to update document:" ,{cause :error});
            }
        }


        public async deleteDocument(
        query: FilterQuery<Partial<IDocument>>
        ): Promise<IDocument | null> {
            try {
                return await documentModel
                .findOneAndDelete(query)
                .lean<IDocument>();
            } catch (error) {
                throw new Error("Failed to delete document:" ,{cause :error});
            }
        }


        public async deleteADocumentFile(
        filter: FilterQuery<Partial<IDocument>>,
        pullQuery: FilterQuery<Partial<IDocument>>
        ): Promise<IDocument | null> {
            
            try 
            {    
                return await documentModel
                            .updateOne
                            ( filter,{ $pull: pullQuery })
                            .lean<IDocument>();
            } 
            catch (error) 
            {
                throw new Error("Failed to delete document:" ,{cause :error});
            }
        }

        
    }