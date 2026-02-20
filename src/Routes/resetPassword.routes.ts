import { Router } from 'express';
import { authMiddleware } from '../Middlewares/authorise.middleware';
import { resetPassController } from '../dependencyInjector';
const router = Router();

router.patch('/reset/:id', authMiddleware, (req, res, next) =>
  resetPassController.updatePasswordVersion2(req, res, next),
);

export default router;
