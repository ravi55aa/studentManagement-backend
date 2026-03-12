import { Router } from 'express';
const router = Router();
import { authMiddleware } from '@Middlewares/authorise.middleware';
import { studentHomeworkController,studentController } from '@DI/resolve';
import upload from 'Config/multer.config';
import { uploadCloud } from 'Config/multerCloud';

router.post("/create/:batchId",
    authMiddleware, 
    upload.single('profile'),
    (req, res, next) => studentController.addNewStudent(req, res, next));

router.get("/getall",authMiddleware, studentController.getAllStudents);

router.route("/:id")
.get(studentController.getAStudent)
.delete(studentController.deleteStudent);
// router.put("/students/:id", studentController.editStudent);



/*****Homework *****/
router.post("/homework/submit/:homeworkId",authMiddleware,uploadCloud.array('docs',10), (req,res,next)=>studentHomeworkController.submitHomework(req,res,next));


export default router;