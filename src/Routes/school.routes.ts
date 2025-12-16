import {Router} 
    from "express"
let router = Router();


import {  
    schoolMetaDataValidateSchema,
    schoolAddressValidateSchema} 
    from "../Validators/school.validator";
import { validateData } 
    from "../Middlewares/validateUser.middleware";
import upload 
    from "../Config/multer.config";
import { uploadCloud } 
    from "../Config/multerCloud";
import { documentController, schoolController } 
    from "../dependencyInjector";
import { authMiddleware } 
    from "../Middlewares/authorise.middleware";


//*create
router.post("/register",
    authMiddleware
    ,upload.single("profile")
    ,validateData(schoolMetaDataValidateSchema)
    ,(req,res,next)=>
        schoolController.createSchool(req,res,next));



router
    .route("/addAddress")
    .post(
        validateData(schoolAddressValidateSchema)
        ,(req,res,next)=>
            schoolController.addAddress(req,res,next));



router
    .route("/document")
    .post(
        uploadCloud.array("docs", 10),
        (req,res,next)=>documentController.addNewDocuments(req,res,next)); 
    //pending userId+tenantId required:true in model



//*get
router.get("/register",
        (req,res,next)=>schoolController.getSchool(req,res,next)
    )


    //pending
    /** authMiddleware attach
     *  userType+userId+tenantId required:true in Model
     *  and validate once
    */

export default router;