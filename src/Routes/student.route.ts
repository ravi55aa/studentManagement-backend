import { Router } from 'express';
const router = Router();
import { authMiddleware } from '@Middlewares/authorise.middleware';
import {
  studentHomeworkController,
  studentController,
  studentAttendanceController,
  stripeController,
} from '@DI/resolve';
import upload from 'Config/multer.config';
import { uploadCloud } from 'Config/multerCloud';

router.post('/create/:batchId', authMiddleware, upload.single('profile'), (req, res, next) =>
  studentController.addNewStudent(req, res, next),
);

router.get('/getall', authMiddleware, (req, res, next) =>
  studentController.getAllStudents(req, res, next),
);

router.patch('/update/:studentId', authMiddleware, 
  uploadCloud.single('profile'), (req, res, next) =>
  studentController.editStudent(req, res, next),
);

router
.route('/bio/:id')
  .get(authMiddleware,(req,res,next)=>
    studentController.getAStudent(req,res,next))
  .delete(studentController.deleteStudent);



/***** Homework *****/
router.post(
  '/homework/submit/:homeworkId',
  authMiddleware,
  uploadCloud.array('docs', 10),
  (req, res, next) => studentHomeworkController.submitHomework(req, res, next),
);

router.get('/homework/getall', authMiddleware, (req, res, next) =>
  studentHomeworkController.getallHomeworkSubmission(req, res, next),
);

/******* Attendance *******/
router.post('/attendance/update/:batchId', authMiddleware, (req, res, next) =>
  studentAttendanceController.markAttendance(req, res, next),
);

router.get('/attendance/getall', authMiddleware, (req, res, next) =>
  studentAttendanceController.getAllAttendance(req, res, next),
);

router.get('/attendance/getOne', authMiddleware, (req, res, next) =>
  studentAttendanceController.getAAttendanceList(req, res, next),
);

// router.get('/attendance/get/:batchId', studentAttendanceController.updateAttendance);
// router.get('/attendance/:id', studentAttendanceController.getAttendanceById);
// router.put('/attendance/:id', studentAttendanceController.updateAttendance);
// router.delete('/attendance/:id', studentAttendanceController.deleteAttendance);
// router.get('/attendance/view/:id', studentAttendanceController.viewAttendance);

/******* Attendance-Apply Leave *******/
router.post('/apply/leave/:studentId', authMiddleware, (req, res, next) =>
  studentAttendanceController.applyLeave(req, res, next),
);

router.get('/get/leaveHistory', authMiddleware, (req, res, next) =>
  studentAttendanceController.getLeaveList(req, res, next),
);


/***STUDENT FEE */
router.get('/fee/details/:studentId', authMiddleware, (req, res, next) =>
  stripeController.getStudentFeeDetails(req, res, next),
);


export default router;

/**
    The data is not updating properly,
    i need to fetch and update the attendance status properly
*/
