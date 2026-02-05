import { mailTransporter } from "../Config/nodemailer.config";

export interface SendMailOptions {
    to: string;
    subject: string;
    html?: string;
    text?: string;
}


export const sendMail = async ({to,subject,html,text,}: SendMailOptions): Promise<void> => 
                {
                    mailTransporter.sendMail({
                        from: `student management`,
                        to,
                        subject,
                        html,
                        text,
                });
    };