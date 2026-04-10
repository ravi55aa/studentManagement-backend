import {Router} from "express";
const router=Router();
import { authMiddleware } from "@Middlewares/authorise.middleware";
import { planController } from "@DI/resolve"; 

// import { roleMiddleware } from '@/middlewares/role.middleware';
//import { Roles } from '@/constants/role.enum';


router.post(
    '/',
    authMiddleware,
    //roleMiddleware(Roles.Admin),
    planController.createPlan
);

// GET ALL PLANS (Admin/User)
router.get(
    '/',
    authMiddleware,
    planController.getAllPlans
);


// GET SINGLE PLAN
router.get(
    '/:id',
    authMiddleware,
    planController.getPlanById
);

// UPDATE PLAN (Admin)
router.patch(
    '/:id',
    authMiddleware,
    //roleMiddleware(Roles.Admin),
    planController.updatePlan
);


// DELETE PLAN (Admin)
router.delete(
    '/:id',
    authMiddleware,
    //roleMiddleware(Roles.Admin),
    planController.deletePlan
);


// TOGGLE ACTIVE STATUS
router.patch(
    '/active/:id',
    authMiddleware,
    //roleMiddleware(Roles.Admin),
    planController.toggleActive
);


//  TOGGLE POPULAR PLAN
router.patch(
    '/popular/:id',
    authMiddleware,
    //roleMiddleware(Roles.Admin),
    planController.togglePopular
);


export default router;