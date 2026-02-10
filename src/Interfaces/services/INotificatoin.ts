import {Request,Response} from "express";


type TRecipients = 'Teacher' | 'Student' | 'Center' | 'School' | 'Batch';

export interface NotificationPayload {
    type: string;
    title: string;
    message: string;
    link?: string|undefined;
    attachmentUrl?: string|undefined;

    sender: {
        model: 'Admin' | 'Teacher';
        id: string;
    };

    recipients: {
        model: TRecipients;
        ids: string[];
    }[];
}



export interface INotificationSender {
    send(payload: NotificationPayload): Promise<void>;
}


//------------ Service-interface
export interface INotificationService {
    addNotification(req:Request,res:Response): Promise<boolean>
}