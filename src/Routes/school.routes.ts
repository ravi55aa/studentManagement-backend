import { Router } from 'express';
const router = Router();

import {
  schoolMetaDataValidateSchema,
  schoolAddressValidateSchema,
} from '../Validators/school.validator';
import { validateData } from '../Middlewares/validateUser.middleware';
import upload from '../Config/multer.config';
import { uploadCloud } from '../Config/multerCloud';
import {
  batchController,
  centerController,
  documentController,
  schoolAcaCourseController,
  schoolAcademicController,
  schoolAcaSubController,
  schoolController,
} from '../dependencyInjector';
import { authMiddleware } from '../Middlewares/authorise.middleware';

//*create
router.post(
  '/register',
  authMiddleware,
  upload.single('profile'),
  validateData(schoolMetaDataValidateSchema),
  (req, res, next) => schoolController.createSchool(req, res, next),
);

router.patch('/update/meta/:id', authMiddleware, uploadCloud.single('profile'), (req, res, next) =>
  schoolController.updateSchoolMeta(req, res, next),
);

router
  .route('/register/addAddress')
  .post(authMiddleware, validateData(schoolAddressValidateSchema), (req, res, next) =>
    schoolController.addAddress(req, res, next),
  );

router.get(
  '/data/fetch',
  authMiddleware,
  (req, res, next) => schoolController.getSchoolData_MDA(req, res, next),
  //MDA = META+DOCUMENTS+ADDRESS
);

/**
 * Document
 */
router
  .route('/register/uploadDocument')
  .post(authMiddleware, uploadCloud.array('docs', 10), (req, res, next) =>
    documentController.addNewDocuments(req, res, next),
  );
//pending userId+tenantId required:true in model

router.put('/document/update', authMiddleware, uploadCloud.array('docs', 10), (req, res, next) =>
  documentController.updateDocuments(req, res, next),
);

router.delete('/document/delete', authMiddleware, (req, res, next) =>
  documentController.addNewDocuments(req, res, next),
);

//*get login
router.get('/login', (req, res, next) => schoolController.getSchool(req, res, next));

/******************** Centers ********************/

router.get('/centers', authMiddleware, (req, res, next) =>
  centerController.getAllCenters(req, res, next),
);

router.post('/centers/add', authMiddleware, (req, res, next) =>
  centerController.addNewCenter(req, res, next),
);

router.post('/centers/add/address/:id', authMiddleware, (req, res, next) =>
  centerController.addNewCenterAddress(req, res, next),
);

router.get('/centers/:id', authMiddleware, (req, res, next) =>
  centerController.getASchoolCenter(req, res, next),
);

router.put('/centers/edit/:id', authMiddleware, (req, res, next) =>
  centerController.editASchoolCenter(req, res, next),
);

router.delete('/centers/:id', authMiddleware, (req, res, next) =>
  centerController.deleteASchoolCenter(req, res, next),
);

/*--------------- BATCHES  ---------------*/
router.post('/batches/add', authMiddleware, (req, res, next) =>
  batchController.addNewBatch(req, res, next),
);

router.get('/batches', authMiddleware, (req, res, next) =>
  batchController.getAllBatches(req, res, next),
);

router.get('/batches/:id', authMiddleware, (req, res, next) =>
  batchController.getASchoolBatch(req, res, next),
);

router.put('/batches/edit/:id', authMiddleware, (req, res, next) =>
  batchController.editASchoolBatch(req, res, next),
);

router.patch('/batch/assign-teacher/:id', authMiddleware, (req, res, next) =>
  batchController.assignClassTeacher(req, res, next),
);

router.delete('/batches/:id', authMiddleware, (req, res, next) =>
  batchController.deleteASchoolBatch(req, res, next),
);

/**************  ACADEMIC YEAR   **************/
router.get('/academicYears', authMiddleware, (req, res, next) =>
  schoolAcademicController.listAllAcademicYear(req, res, next),
);

router.get('/academicYears/:id', authMiddleware, (req, res, next) =>
  schoolAcademicController.getASchoolAcademicYear(req, res, next),
);

router.post('/academicYears/add', authMiddleware, (req, res, next) =>
  schoolAcademicController.addNewYear(req, res, next),
);

router.put('/academicYears/edit/:id', authMiddleware, (req, res, next) =>
  schoolAcademicController.editAnAcademicYearById(req, res, next),
);

router.delete('/academicYears/:id', authMiddleware, (req, res, next) =>
  schoolAcademicController.deleteAnSchoolAcademicYearById(req, res, next),
);

/**************  ACADEMIC SUBJECT   **************/
router.post('/academic/subjects/add', uploadCloud.array('docs', 10), (req, res, next) =>
  schoolAcaSubController.addNewSchoolSubject(req, res, next),
);

router.get('/academic/subjects', authMiddleware, (req, res, next) =>
  schoolAcaSubController.listAllSchoolAcademicSubjects(req, res, next),
);

router.get('/academic/subjects/:id', authMiddleware, (req, res, next) =>
  schoolAcaSubController.getASchoolAcademicSubject(req, res, next),
);

router.post(
  '/academic/subjects/edit/v1/:id',
  authMiddleware,
  uploadCloud.array('docs', 10),
  (req, res, next) => schoolAcaSubController.editASchoolAcademicSubject(req, res, next),
);

router.delete('/academic/subjects/:id', authMiddleware, (req, res, next) =>
  schoolAcaSubController.deleteASchoolAcademicSubject(req, res, next),
);

/**************  ACADEMIC COURSE   **************/
router.post('/academic/courses/add', uploadCloud.array('docs', 10), (req, res, next) =>
  schoolAcaCourseController.addNewSchoolCourse(req, res, next),
);

router.get('/academic/courses', authMiddleware, (req, res, next) =>
  schoolAcaCourseController.listAllSchoolAcademicCourses(req, res, next),
);

router.get('/academic/courses/:id', authMiddleware, (req, res, next) =>
  schoolAcaCourseController.getASchoolAcademicCourse(req, res, next),
);

router.put(
  '/academic/courses/edit/:id',
  authMiddleware,
  uploadCloud.array('docs', 10),
  (req, res, next) => schoolAcaCourseController.editASchoolAcademicCourse(req, res, next),
);

router.delete('/academic/courses/:id', authMiddleware, (req, res, next) =>
  schoolAcaCourseController.deleteASchoolAcademicSubject(req, res, next),
);

export default router;
