import { Router } from 'express';
const router = Router();
import { authMiddleware } from '@Middlewares/authorise.middleware';
import { planController } from '@DI/resolve';
import upload from 'Config/multer.config';

// import { roleMiddleware } from '@/middlewares/role.middleware';
//import { Roles } from '@/constants/role.enum';

router.post(
  '/plans/add',
  authMiddleware,
  //roleMiddleware(Roles.Admin),
  upload.single('profile'),
  (req, res, next) => planController.createPlan(req, res, next),
);

// GET ALL PLANS (Admin/User)
router.get(
  '/plans',
  //authMiddleware,
  (req, res, next) => planController.getAllPlans(req, res, next),
);

// GET SINGLE PLAN
router.get('/plans/:planId', authMiddleware, (req, res, next) =>
  planController.getPlanById(req, res, next),
);

// UPDATE PLAN (Admin)
router.patch(
  '/plans/:planId',
  authMiddleware,
  //roleMiddleware(Roles.Admin),
  (req, res, next) => planController.updatePlan(req, res, next),
);

// DELETE PLAN (Admin)
router.delete(
  '/plans/:planId',
  authMiddleware,
  //roleMiddleware(Roles.Admin),
  (req, res, next) => planController.deletePlan(req, res, next),
);

// TOGGLE ACTIVE STATUS
router.patch(
  '/plans/active/:planId',
  authMiddleware,
  //roleMiddleware(Roles.Admin),
  planController.toggleActive,
);

//  TOGGLE POPULAR PLAN
router.patch(
  '/plans/popular/:planId',
  authMiddleware,
  //roleMiddleware(Roles.Admin),
  planController.togglePopular,
);

export default router;
