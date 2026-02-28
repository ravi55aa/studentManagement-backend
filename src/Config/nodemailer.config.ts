import nodemailer from 'nodemailer';

import env from './env.config';

export const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.NODEMAIL_MAIL,
    pass: env.NODEMAIL_MAIL_PASS,
  },
});

//refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
