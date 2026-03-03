import { Router } from 'express';

import { authMiddleware } from '../Middlewares/authorise.middleware';
import { feeController } from '../DI/resolve';
const router = Router();

router.post('/add', authMiddleware, (req, res, next) => feeController.createFee(req, res, next));

router.get('/get/all', authMiddleware, (req, res, next) =>
  feeController.getAllFees(req, res, next),
);

router.get('/get/:id', authMiddleware, (req, res, next) =>
  feeController.getFeeById(req, res, next),
);

router.patch('/edit/:id', authMiddleware, (req, res, next) =>
  feeController.updateFee(req, res, next),
);

router.delete('/delete/:id', authMiddleware, (req, res, next) =>
  feeController.deleteFee(req, res, next),
);

export default router;
