import { Router} from "express";
const router=Router();


import { authMiddleware } from "../Middlewares/authorise.middleware";
import { teacherController } from "../dependencyInjector";
import { uploadCloud } from "../Config/multerCloud";


router.post(
    "/bio/create",
    authMiddleware,
    uploadCloud.fields([
    { name: "profile", maxCount: 1 },
    { name: "docs", maxCount: 10 },
    ]),
    (req,res,next)=>
        teacherController.createTeacherBio(req,res,next));

router.post(
    "/create/:id",
    authMiddleware,
    (req,res,next)=>
        teacherController.createTeacher(req,res,next));


router.get(
    "/read",
    authMiddleware,
    (req,res,next)=>
        teacherController.getAllTeachers(req,res,next));



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


//! PENDING
/**
 * GIVING ERR WHILE DUPLICATE CREATION, BUT NOW SHOWING properly in th F.End
 * Creating multiple teachers for the same class-error
 * */