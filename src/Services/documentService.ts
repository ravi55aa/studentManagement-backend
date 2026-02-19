
import { serviceReturnType } from "../Constants/interfaces";
import { IDocumentRepository } from "../Interfaces/repository/IDocument.interface";
import { IDocumentService } 
    from "../Interfaces/services/IDocument.service";
import { IDocument } from "../Models/documentModel";
import { Request,Response } from "express";
import { DocumentsDto } from "../dto/schoolDTO";
import { SchoolResponseBody } from "../Utils/ResponseBody/school.responce.body";
import { inject, injectable } from "tsyringe";
import { DocumentRepository } from "../Repository/documentRepository";



@injectable()
export class DocumentService implements IDocumentService{

    constructor(
        @inject(DocumentRepository)
        private documentRepository:DocumentRepository)
        {}

    public async uploadDocs(data: IDocument): 
    Promise<IDocument|null> 
    {
        const uploadedData=await this.documentRepository.uploadDocuments(data);
        return uploadedData;
    }


    public async updateDocs(req:Request,res:Response): Promise<serviceReturnType> 
    {
        const {dtoData,dtoQuery} = 
            DocumentsDto.updateDoc(req,res);

        const uploadedData:Partial<IDocument|null> = 
            await this.documentRepository.updateDocuments(dtoQuery,dtoData);
        
        const respBodyOdds={
            message:"Successfully updated",
            error:"Something went error",
            errMessage:"Cant update the document",
            statusCode:200
        }
        const {status,resBody} = 
            SchoolResponseBody.forUpdate<Partial<IDocument>> 
                (
                    uploadedData,
                    respBodyOdds.error,
                    respBodyOdds.message,
                    respBodyOdds.errMessage,
                    respBodyOdds.statusCode
                );
        
        return {status,resBody};
    }


    public async update_NewAddition_Documents(req:Request,res:Response): Promise<serviceReturnType> 
    {
        const {dtoData,dtoQuery} = 
            DocumentsDto.updateDocV2(req,res);

        const uploadedData:Partial<IDocument|null> = 
            await this.documentRepository.updateNEWUploadDocuments(dtoQuery,dtoData);
        
        const respBodyOdds={
            message:"Successfully updated",
            error:"Something went error",
            errMessage:"Cant update the document",
            statusCode:200
        }

        const {status,resBody} = 
            SchoolResponseBody.forUpdate<Partial<IDocument>> 
                (
                    uploadedData,
                    respBodyOdds.error,
                    respBodyOdds.message,
                    respBodyOdds.errMessage,
                    respBodyOdds.statusCode
                );
        
        return {status,resBody};
    };


    public async deleteDocument(req:Request,res:Response): Promise<serviceReturnType> 
    {
        const query=DocumentsDto.deleteDoc(req,res);

        const docsDel=await this.documentRepository.deleteDocument(query);

        const {status,resBody}=SchoolResponseBody.handleDeleteOneResBody<Partial<IDocument>>(docsDel);

        return {status,resBody};
    }

    public async deleteAFile(req:Request,res:Response): Promise<serviceReturnType> 
    {
        const {filterQuery,pullQuery}=DocumentsDto.removeOneDocument(req,res);

        const docsDel=await this.documentRepository.deleteADocumentFile(filterQuery,pullQuery);

        const {status,resBody}=SchoolResponseBody.handleDeleteOneResBody<Partial<IDocument>>(docsDel);

        return  {status,resBody};
    }

}