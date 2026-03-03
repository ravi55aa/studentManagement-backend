import { mailTransporter } from '../Config/nodemailer.config';

export interface SendMailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export const sendMail = async ({ to, subject, html, text }: SendMailOptions): Promise<void> => {
  mailTransporter.sendMail({
    from: `student management`,
    to,
    subject,
    html,
    text,
  });
};

export const handleMailOptions = (newOtp: string) => {
  const mailOptions: SendMailOptions = {
    to: 'raviaa912@gmail.com',
    subject: 'Password change otp',
    html: `<P>You're otp is ${newOtp}</p>1}
            sendMail`,
    text: 'kindly Update the otp',
  };

  return mailOptions;
};
