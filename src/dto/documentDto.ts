import {Request} 
    from "express";
import { IDocument } 
    from "../Models/documentModel";


    export class DocumentDTO{

        static handleDtoOfDoc(req:Request):Partial<IDocument>{
                const files=req.files as Express.Multer.File[];
                const docs = files.map((f) => ({
                    url: f.path,
                    publicId: f.filename,
                }));
                
                return {
                    userId:req.user?.userId,
                    tenantId:req.user?.tenantId,
                    role:req.cookies.role || "school",
                    docs
                };
        }
    }
