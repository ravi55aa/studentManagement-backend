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
 * */

/*****HOMEWORK******/
router
  .route('/homework')
  .get(authMiddleware, 
    (req, res, next) => homeworkController.getOneHomework(req, res, next))
  .patch(authMiddleware, 
    (req, res, next) => homeworkController.updateHomework(req, res, next))
  .put(authMiddleware, 
    (req, res, next) => homeworkController.updateHomework(req, res, next))
  .delete(authMiddleware, 
    (req, res, next) => homeworkController.deleteHomework(req, res, next))
  .post(authMiddleware, uploadCloud.array('docs',10) ,
    (req, res, next) => homeworkController.createHomework(req, res, next));

router.get('/homework/getall', authMiddleware, (req, res, next) =>
  homeworkController.getAllHomework(req, res, next),
);

    router
      .route('/:id')
      .get(authMiddleware, (req, res, next) => teacherController.getTeacherById(req, res, next))
      .patch(authMiddleware, (req, res, next) => teacherController.createTeacher(req, res, next))
      .delete(authMiddleware, (req, res, next) => teacherController.createTeacher(req, res, next))
      .post(authMiddleware, (req, res, next) => teacherController.createTeacher(req, res, next));