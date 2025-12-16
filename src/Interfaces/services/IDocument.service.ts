import { IDocument } from "../../Models/documentModel";

export interface IDocumentService{
    uploadDocs(data:Partial<IDocument>):Promise<IDocument|null>
}