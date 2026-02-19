import {Router} from "express";
const router=Router();

import { authMiddleware } from "../Middlewares/authorise.middleware";
import { notificationController } from "../dependencyInjector";

router.post("/new",
    authMiddleware,
    (req,res,next)=>notificationController.addNewNotification(req,res,next));

router.get("/get-all",
    authMiddleware,
    (req,res,next)=>notificationController.getAllNotification(req,res,next));


export default router;