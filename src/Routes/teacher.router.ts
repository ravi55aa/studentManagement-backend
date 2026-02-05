import { Router} from "express";
import { authMiddleware } from "../Middlewares/authorise.middleware";
import { teacherController } from "../dependencyInjector";
const router=Router();


router.post(
    "/create",
    authMiddleware,
    (req,res,next)=>
        teacherController.createTeacherBio(req,res,next));


//* Using the SAME route with DIFFERENT HTTP METHODS is best 
//* But ONLY when the action represents the SAME RESOURCE


router.route("/:id")
    .patch(authMiddleware,
        (req,res,next)=>teacherController.createTeacher(req,res,next))
    .delete(authMiddleware,
        (req,res,next)=>teacherController.createTeacher(req,res,next))
    .post(authMiddleware,
        (req,res,next)=>teacherController.createTeacher(req,res,next));

export default router;


