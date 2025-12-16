import { Request,Response,NextFunction } 
    from "express";

import { IDocumentService } 
    from "../Interfaces/services/IDocument.service";
import { IDocument } 
    from "../Models/documentModel";
import { IResponse } 
    from "../Interfaces/IResponse";
import { DocumentDTO } 
    from "../dto/documentDto";
import { handleDocRespBody } from "../Utils/responseBody";
import { StatusCodes } from "../Constants/statusCodes";





export class DocumentController{

    private documentService:IDocumentService;



    constructor(documentService:IDocumentService){
        this.documentService=documentService;
    }




    public async addNewDocuments(req:Request,res:Response,next:NextFunction) : 
    Promise<void>{    
        try{

            const dto
                = DocumentDTO.handleDtoOfDoc(req);

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

}