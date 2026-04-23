/// <reference path="./types/express/index.d.ts"/>

import express, { Request, Response } from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { stripeController } from '@DI/resolve';
import { handleSubdomainResolver } from '@Middlewares/roleBaseAuth.middleware';
import handleErrorsMiddleware from '@Middlewares/error.middleware';

import { sessionConfig, connectDB } from './Config/index';
import {
  oauthRouter,
  authRouter,
  schoolRouter,
  addressRouter,
  documentsRouter,
  resetPassword,
  teacherRouter,
  notificationRouter,
  stripeRouter,
  feesRouter,
  studentRouter,
  chatRouter,
  adminRouter,
} from './Routes/index';
import logger from './Utils/logger';

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isLocalhost = origin === 'http://localhost:5173';

      const isSubdomain = /^http:\/\/([a-z0-9-]+)\.localhost:5173$/.test(origin);

      if (isLocalhost || isSubdomain) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },

    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(sessionConfig());
app.use(express.urlencoded({ extended: true }));
app.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json' }),
  (req: Request, res: Response) => stripeController.callWebHook(req, res),
);
app.use(express.json());
app.use(handleSubdomainResolver);

connectDB();

app.use('/google', oauthRouter);
app.use('/auth', authRouter);
app.use('/school', schoolRouter);
app.use('/address', addressRouter);
app.use('/documents', documentsRouter);
app.use('/password', resetPassword);
app.use('/teacher', teacherRouter);
app.use('/student', studentRouter);
app.use('/notification', notificationRouter);
app.use('/stripe', stripeRouter);
app.use('/fee', feesRouter);
app.use('/chat', chatRouter);
app.use('/admin', adminRouter);

app.use((req, res) => {
  logger.error(' Route not found:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

app.use(handleErrorsMiddleware);

export default app;
