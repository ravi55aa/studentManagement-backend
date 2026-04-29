import { chatController } from '@DI/resolve';
import { authMiddleware } from '@Middlewares/authorise.middleware';
import { uploadCloud } from 'Config/multerCloud';
import { NextFunction, Router, Request, Response } from 'express';
const router = Router();

//main route = '/chat'
router.post('/direct', (req: Request, res: Response, next: NextFunction) =>
  chatController.createDirectChat(req, res, next),
);

//create route = '/chat/batch'
router.post('/batch', (req: Request, res: Response, next: NextFunction) =>
  chatController.createBatchChat(req, res, next),
);

router.get('/:userId', (req: Request, res: Response, next: NextFunction) =>
  chatController.getUserChats(req, res, next),
);

router.post('/message', 
  authMiddleware,
  uploadCloud.array('docs', 5),
  (req: Request, res: Response, next: NextFunction) =>
  chatController.sendMessage(req, res, next),
);

router.get('/messages/:chatRoomId', (req: Request, res: Response, next: NextFunction) =>
  chatController.getMessages(req, res, next),
);

export default router;
