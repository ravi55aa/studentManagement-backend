//DTO
import { Request,Response } from "express";

import { NotificationPayload } from "../Interfaces/services/INotificatoin";
import { SchoolAcademicYearDto } from "./schoolDTO";

export class NotificationDto {
    static addNotification(req:Request,res:Response){
        const {
            type,title,
            message,link,attachmentUrl,
            
        }:Partial<NotificationPayload>=req.body;

        const fields= Object.keys(req.body);
        
        for(const field of fields){
            if(field == "link" || 
                field=="attachmentUrl") continue;

            if(!req.body[field]){
                throw new Error(`${field} Cannot be empty`);
            }
        }

        const decodedToken=SchoolAcademicYearDto.getTenantId(req,res);

        const updateSender={
            model: "Admin", //late update to 'decodedToken.role'
            id:decodedToken.adminId 
        }

        const payload:NotificationPayload = {
            type:type!,
            title:title!,
            message:message!,
            sender:updateSender!,
            link,
            attachmentUrl
        }

        return payload;
    }
}
