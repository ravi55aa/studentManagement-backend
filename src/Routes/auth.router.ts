import { Router } from "express";
const router = Router();
import { validateUser } from "../Middlewares/validateUser.middleware";
import { RegisterUserSchema } from "../Validators/user.validator";

router.post("/admin/register", 
    validateUser(RegisterUserSchema),
    
);

export default router;
