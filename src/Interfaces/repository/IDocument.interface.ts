import {IDocument} from "../../Models/documentModel"


export interface IDocumentRepository{
    uploadDocuments(data:IDocument):Promise<IDocument|null>
}