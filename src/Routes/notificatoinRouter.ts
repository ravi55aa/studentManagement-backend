import { Router } from 'express';
const router = Router();

import { authMiddleware } from '../Middlewares/authorise.middleware';
import { notificationController } from '../DI/resolve';

router.post('/new', authMiddleware, (req, res, next) =>
  notificationController.addNewNotification(req, res, next),
);

router.get('/getAll', authMiddleware, (req, res, next) =>
  notificationController.getAllNotification(req, res, next),
);

router.get('/getAll/user/:userId', authMiddleware, (req, res, next) =>
  notificationController.getAllUserNotification(req, res, next),
);

router.patch('/read/:userNotificationId', authMiddleware, (req, res, next) =>
  notificationController.readNotification(req, res, next),
);

export default router;
