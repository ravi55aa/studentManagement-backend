import { Request,Response,NextFunction } 
    from "express";

import { IDocumentService } 
    from "../Interfaces/services/IDocument.service";
import { IDocument } 
    from "../Models/documentModel";
import { IResponse } 
    from "../Interfaces/IResponse";
import { handleDocRespBody } from "../Utils/responseBody";
import { StatusCodes } from "../Constants/statusCodes";
import { DocumentsDto } from "../dto/schoolDTO";





export class DocumentController{

    private documentService:IDocumentService;


    constructor(documentService:IDocumentService){
        this.documentService=documentService;
    }


    public async addNewDocuments(req:Request,res:Response,next:NextFunction) : 
    Promise<void>{    
        try{

            //dto
            //service_call
            //res + catchError

            let dto
                = DocumentsDto.handleDtoOfDoc(req);
            dto.userId=dto.tenantId

            const resDoc
            = this.documentService.uploadDocs(dto);

            const resBody:IResponse<Promise<IDocument|null>> 
            = handleDocRespBody(resDoc);

            res
            .status(StatusCodes.OK)
            .json(resBody);

        }catch(err){
            next(err);
        }
    }


    public async updateDocuments(req:Request,res:Response,next:NextFunction) : 
    Promise<void>{    
        try{

            const {status,resBody}
            = await this.documentService.updateDocs(req,res);

            res
            .status(status)
            .json(resBody);
            
        }catch(err){
            next(err);
        }
    }

//Plural
    public async deleteDocuments(req:Request,res:Response,next:NextFunction) : 
    Promise<void>{    
        try{

            const {status,resBody}
            = await this.documentService.deleteDocument(req,res);

            res
            .status(status)
            .json(resBody);
            
        }catch(err){
            next(err);
        }
    }


//Singular
    public async deleteADocumentFile(req:Request,res:Response,next:NextFunction) : 
    Promise<void>{    
        try{

            const {status,resBody}
            = await this.documentService.deleteAFile(req,res);

            res
            .status(status)
            .json(resBody);
            
        }catch(err){
            next(err);
        }
    }


    public async uploadAdditionDocuments(req:Request,res:Response,next:NextFunction) : 
    Promise<void>{    
        try{

            const {status,resBody}
            = await this.documentService.update_NewAddition_Documents(req,res);

            res
            .status(status)
            .json(resBody);
            
        }catch(err){
            next(err);
        }
    }

}