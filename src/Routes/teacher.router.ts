import { Router } from 'express';
const router = Router();

import { authMiddleware } from '../Middlewares/authorise.middleware';
import { homeworkController, teacherController } from '../DI/resolve';
import { uploadCloud } from '../Config/multerCloud';

router.post(
  '/bio/create',
  authMiddleware,
  uploadCloud.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'docs', maxCount: 10 },
  ]),
  (req, res, next) => teacherController.createTeacherBio(req, res, next),
);

router.patch(
  '/bio/update/:id',
  authMiddleware,
  uploadCloud.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'docs', maxCount: 10 },
  ]),
  (req, res, next) => teacherController.createTeacher(req, res, next),
);

router.post('/create/:id', authMiddleware, (req, res, next) =>
  teacherController.createTeacher(req, res, next),
);

router.get('/all', authMiddleware, (req, res, next) =>
  teacherController.getAllTeachers(req, res, next),
);

router.get('/all/unAssigned', authMiddleware, (req, res, next) =>
  teacherController.getAllUnAssignedTeachers(req, res, next),
);

router.patch('/assignToBatch/:id', authMiddleware, (req, res, next) =>
  teacherController.assignClassToTeacher(req, res, next),
);

router.get('/verify/:email', (req, res, next) => teacherController.verifyTeacher(req, res, next));

export default router;

//! PENDING
/**
 * GIVING ERR WHILE DUPLICATE CREATION, BUT NOW SHOWING properly in th F.End
 * Creating multiple teachers for the same class-error
 **/

/*****HOMEWORK******/
router.get('/homework/get/:id', authMiddleware, (req, res, next) =>
  homeworkController.getOneHomework(req, res, next),
);

router.get('/homework/getall', authMiddleware, (req, res, next) =>
  homeworkController.getAllHomework(req, res, next),
);

router
  .route('/:id')
  .get(authMiddleware, (req, res, next) => teacherController.getTeacherById(req, res, next))
  .patch(authMiddleware, (req, res, next) => teacherController.createTeacher(req, res, next))
  .delete(authMiddleware, (req, res, next) => teacherController.createTeacher(req, res, next))
  .post(authMiddleware, (req, res, next) => teacherController.createTeacher(req, res, next));

//teacher she is evaluating the homework submitted by the students;
//when she click on the homework, she can see each students homework history,
//Batch -> Students ->homework is also has the studentId,
//fetch All the Homeworks associated to the studentId;
//if(status==submitted){
//   show the attachments
// } else pending noAttachment;
