import { Router } from 'express';
const router = Router();

import upload from '../Config/multer.config';
import { validateData } from '../Middlewares/validateUser.middleware';
import { registerUserSchema, signInSchema } from '../Validators/user.validator';
import { userAuthController, resetPassController } from '../DI/resolve';

router.post('/admin/login', validateData(signInSchema), (req, res, next) =>
  userAuthController.login(req, res, next),
);

router.post('/login', (req, res, next) => userAuthController.login(req, res, next));

router.post(
  '/admin/register',
  upload.single('profile'),
  validateData(registerUserSchema),
  (req, res, next) => userAuthController.register(req, res, next),
);

//*password reset

router
  .route('/forgot-password/verifyEmail')
  .get(() => {})
  .post((req, res, next) => resetPassController.verifyEmail(req, res, next));

router
  .route('/forgot-password/generateOtp/:id')
  .get((req, res, next) => resetPassController.getOtp(req, res, next))
  .post((req, res, next) => resetPassController.verifyEmail(req, res, next));

router
  .route('/forgot-password/verifyOtp/:id')
  .get((req, res, next) => resetPassController.otpVerification(req, res, next))
  .post((req, res, next) => resetPassController.otpVerification(req, res, next));

router
  .route('/forgot-password/updatePassword/:id')
  .get(() => {})
  .patch((req, res, next) => resetPassController.updateNewPassword(req, res, next));

export default router;
