import { Router } from "express";
const router = Router();
import {validateData,} 
    from "../Middlewares/validateUser.middleware";
import { 
    registerUserSchema, 
    signInSchema } 
    from "../Validators/user.validator";
import upload 
    from "../Config/multer.config";

//dependency-I
import { userAuthController } 
    from "../dependencyInjector";

router.post(
    "/admin/login",
    validateData(signInSchema), 
    (req, res, next) => userAuthController.signIn(req, res, next)
);

router.post(
    "/admin/register",
    upload.single("profile"),
    validateData(registerUserSchema),
    (req, res, next) => userAuthController.register(req, res, next)
);

export default router;
