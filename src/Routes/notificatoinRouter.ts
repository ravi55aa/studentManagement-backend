import {Router} from "express";
import { authMiddleware } from "../Middlewares/authorise.middleware";
import { notificationController } from "../dependencyInjector";
const router=Router();

router.post("/notification/add",authMiddleware,(req,res,next)=>notificationController.addNotification(req,res,next));

export default router;