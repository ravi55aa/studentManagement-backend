import { IDocumentRepository } from "../Interfaces/repository/IDocument.interface";
import { IDocumentService } 
    from "../Interfaces/services/IDocument.service";
import { IDocument } from "../Models/documentModel";

export class DocumentService implements IDocumentService{
    private documentRepository:IDocumentRepository;

    constructor(documentRepo:IDocumentRepository){
        this.documentRepository=documentRepo;
    }

    public async uploadDocs(data: IDocument): Promise<IDocument|null> {
        
        const uploadedData=await this.documentRepository.uploadDocuments(data);
        return uploadedData;
    }
}