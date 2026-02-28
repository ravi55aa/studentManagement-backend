import { Router } from 'express';

import { documentController } from '../dependencyInjector';
import { authMiddleware } from '../Middlewares/authorise.middleware';
import { uploadCloud } from '../Config/multerCloud';
const router = Router();

router
  .route('/:userId')
  .delete(authMiddleware, (req, res, next) =>
    documentController.deleteADocumentFile(req, res, next),
  )
  .put(authMiddleware, uploadCloud.array('docs', 10), (req, res, next) =>
    documentController.uploadAdditionDocuments(req, res, next),
  );

export default router;
