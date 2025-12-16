import { BaseRepository } from "./BaseRepository";
import documentModel ,{ IDocument } from "../Models/documentModel";
import { IDocumentRepository } from "../Interfaces/repository/IDocument.interface";




export class DocumentRepository
        extends BaseRepository<IDocument> 
                implements IDocumentRepository
    
    {

        constructor()
        {
            super(documentModel);
        }


        public async uploadDocuments(data: IDocument) 
        : Promise<IDocument|null> 
        {
            const newDoc=new documentModel(data); 
            await newDoc.save();
            return newDoc;
        }
    }