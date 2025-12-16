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
 * school
*/
import { SchoolRepository } 
    from "./Repository/schoolRepository";
import { SchoolService } 
    from "./Services/schoolService";
import { SchoolController } 
    from "./Controller/SchoolAdd.Controller";

export const schoolRepository=new SchoolRepository();
export const schoolService=new SchoolService(schoolRepository,useRepository);
export const schoolController=new SchoolController(schoolService);




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