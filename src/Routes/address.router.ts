import { Router } from 'express';
const router = Router();

import { authMiddleware } from '../Middlewares/authorise.middleware';
import { addressController } from '../DI/resolve';

router.get('/get/:id', authMiddleware, (req, res, next) =>
  addressController.getAddressById(req, res, next),
);

router.get('/all', authMiddleware, (req, res, next) =>
  addressController.getAllAddress(req, res, next),
);

router.put('/edit/:id', authMiddleware, (req, res, next) =>
  addressController.updateAddress(req, res, next),
);

router.patch('/edit/:id', authMiddleware, (req, res, next) =>
  addressController.updateAddress(req, res, next),
);

export default router;
