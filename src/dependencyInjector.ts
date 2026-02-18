/**
 * Address 
 * */
import { AddressRepository } from "./Repository/addressRepository";
import { AddressService } from "./Services/addressService";
import { AddressController } from "./Controller/AddressController";

const addressRepo=new AddressRepository()
const addSer=new AddressService(addressRepo)
export const addController=new AddressController(addSer);


/**
 * Document
 */
import { DocumentRepository } 
    from "./Repository/documentRepository";
import { DocumentService } 
    from "./Services/documentService";
import { DocumentController } 
    from "./Controller/DocumentController";

const docRepository=new DocumentRepository();
const docService=new DocumentService(docRepository);
export const documentController=new DocumentController(docService);


/**
 * adminAuth
*/
import { UserRepository } 
    from "./Repository/userRepository";
import { UserAuthService } 
    from "./Services/userAuthService";
import { UserAuthController } 
    from "./Controller/UserAuthControlller";

export const useRepository=new UserRepository()
export const userAuthService=new UserAuthService(useRepository);
export const userAuthController=new UserAuthController(userAuthService);



/**
 * Reset Password
*/
import { ForgotPasswordRepository } 
    from "./Repository/forgotPassword.Repository";
import { ForgotPasswordService } 
    from "./Services/forgotPassword.service";
import { PasswordResetController } 
    from "./Controller/Resetpassword.controller";

export const resetPassRepository=new ForgotPasswordRepository()
export const resetPassService=new ForgotPasswordService(resetPassRepository);
export const resetPassController=new PasswordResetController(resetPassService);




/**
 * school
*/
import { SchoolRepository } 
    from "./Repository/schoolRepository";
import { SchoolService } 
    from "./Services/schoolService";
import { SchoolController } 
    from "./Controller/SchoolAdd.Controller";

export const schoolRepository=new SchoolRepository();
export const schoolService=new SchoolService(schoolRepository,useRepository,addressRepo,docRepository);
export const schoolController=new SchoolController(schoolService);

/**
 * school Center
*/
import { CenterRepository } 
    from "./Repository/centerRepository";
import { CentersService } 
    from "./Services/centersService";
import { CentersController } 
    from "./Controller/CentersControllert";

export const centerRepository=new CenterRepository();
export const centerService=new CentersService(addressRepo,centerRepository);
export const centerController=new CentersController(centerService);


/**
 * school BATCH
*/
import { BatchRepository } 
    from "./Repository/batchRespository";
import { BatchService } 
    from "./Services/batchService";
import { BatchController } 
    from "./Controller/BatchController";

export const batchRepository=new BatchRepository();
export const batchService=new BatchService(batchRepository);
export const batchController=new BatchController(batchService);




/**
 * school Academic Year
*/
import { AcademicYearRepository } 
    from "./Repository/academicYear.Respository";
import { SchoolYear } 
    from "./Services/school.year.service";
import { SchoolAcademicController } 
    from "./Controller/School.Acadmic.Controller";

export const schoolAcademicYearRepository=new AcademicYearRepository();
export const schoolAcademicService=new SchoolYear(schoolAcademicYearRepository);
export const schoolAcademicController=new SchoolAcademicController(schoolAcademicService);



/**
 * school Academic Subject
*/
import { AcademicSubjectRepository } 
    from "./Repository/academicYear.Respository";
import { SchoolAcademicSubjectSer } 
    from "./Services/school.year.service";
import { SchoolAcademicSubjectController } 
    from "./Controller/School.Acadmic.Controller";

export const schoolAcaSubRepo=new AcademicSubjectRepository();
export const schoolAcaSubSer=new SchoolAcademicSubjectSer(schoolAcaSubRepo,batchRepository);
export const schoolAcaSubController=new SchoolAcademicSubjectController(schoolAcaSubSer);


/**
 * school Academic Course
*/
import { AcademicCourseRepository } 
    from "./Repository/academicYear.Respository";
import { SchoolAcademicCoursesService } 
    from "./Services/school.year.service";
import { SchoolAcademicCourseController } 
    from "./Controller/School.Acadmic.Controller";

const schoolAcaCourseRepo=new AcademicCourseRepository();
const schoolAcaCourseSer=new SchoolAcademicCoursesService(schoolAcaCourseRepo,batchRepository,schoolAcaSubRepo);
export const schoolAcaCourseController=new SchoolAcademicCourseController(schoolAcaCourseSer);




/**
 * TEACHER
 */
import { TeacherRepository } 
    from "./Repository/teacherRepo";
import { TeacherService } 
    from "./Services/teacherService";
import { TeacherController } 
    from "./Controller/TeacherController";

const teacherRepo=new TeacherRepository();
const teacherSer=new TeacherService(teacherRepo);
export const teacherController=new TeacherController(teacherSer);



/**
 * Notification
 */
import {NotificationService, UserNotificationService } 
    from "./Services/notificationService";
import { NotificationController } 
    from "./Controller/NotificatoinController";
import { NotificationRepo } from "./Repository/notificationRepo";
    

const userNotificationService=new UserNotificationService();
const NotifyRepo=new NotificationRepo();

const notificationSer= new NotificationService(NotifyRepo,userNotificationService);
export const notificationController=new NotificationController(notificationSer);


//**FEE ADDING */
import { FeeRepository } 
    from "./Repository/feeRepository";
import {FeeService } 
    from "./Services/feesService";
import { FeeController } 
    from "./Controller/FessController";

const feesRepo=new FeeRepository();
const feeSer= new FeeService(feesRepo);
export const feeController=new FeeController(feeSer);