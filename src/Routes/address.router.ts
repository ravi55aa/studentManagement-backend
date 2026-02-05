import { Router } 
    from "express";
const router = Router();

import { authMiddleware } from "../Middlewares/authorise.middleware";

import { addController } from "../dependencyInjector";


router.get("/get/:id",
    authMiddleware,
    (req, res, next) => addController.getAddressById(req, res, next)
);

router.get("/all",
    authMiddleware,
    (req, res, next) => addController.getAddressAllAddress(req, res, next)
);

router.put("/edit/:id",
    authMiddleware,
    (req,res,next)=>addController.updateAddress(req,res,next)
);

// router.delete("/delete/:id",
//     authMiddleware,
//     (req,res,next)=>addController.deleteAddress(req,res,next)
// );


export default router;