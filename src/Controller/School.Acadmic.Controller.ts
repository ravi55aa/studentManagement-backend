import { Request,Response,NextFunction } 
    from "express";
import { serviceReturnType } 
    from "../Constants/interfaces";
import { ISchoolAcademicCourseSer, ISchoolAcademicSubjectSer, ISchoolAcademicYear } 
    from "../Interfaces/services/ISchoolAcademicYear";
import coursesModel, { coursesMetaModel } from "../Models/courses.model";

/******** SCHOOL YEAR********/
export class SchoolAcademicController{
    
    private academicService:ISchoolAcademicYear;


    constructor(as:ISchoolAcademicYear){
        this.academicService=as;
    }


    async addNewYear(req:Request,res:Response,next:NextFunction){
        try{
            
            const {status,resBody}:serviceReturnType=await this.academicService.addNewSchoolYear(req,res);
    
            res.status(status).json(resBody);
        } catch(err){
            next(err);
        }
    }

    async getASchoolAcademicYear(req:Request,res:Response,next:NextFunction){
        try{
            const {status,resBody}:serviceReturnType=await this.academicService.getAAcademicYear(req,res);
    
            res.status(status).json(resBody);
        } catch(err){
            next(err);
        }
    }

    async listAllAcademicYear(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody} = await this.academicService.listAllAcademicYears(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }

    async editAnAcademicYearById(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody} = await this.academicService.updateAcademicYear(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }


    async deleteAnSchoolAcademicYearById(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody} = await this.academicService.deleteAcademicYear(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }
}




/******** SCHOOL SUBJECTS********/
export class SchoolAcademicSubjectController{
    
    private service:ISchoolAcademicSubjectSer;


    constructor(as:ISchoolAcademicSubjectSer){
        this.service=as;
    }


    async addNewSchoolSubject(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody}:serviceReturnType=await this.service.addAcademicSubject(req,res);
    
            res.status(status).json(resBody);
        } catch(err){
            next(err);
        }
    }

    async listAllSchoolAcademicSubjects(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody} = await this.service.listAllAcademicSubjects(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }

//Pending*****

    async getASchoolAcademicSubject(req:Request,res:Response,next:NextFunction){
        try{
            const {status,resBody}:serviceReturnType=await this.service.getAnAcademicSubject(req,res);
    
            res.status(status).json(resBody);
        } catch(err){
            next(err);
        }
    }


    async editASchoolAcademicSubject(req:Request,res:Response,next:NextFunction){
        try{
            const {status,resBody} = await this.service.updateAnAcademicSubject(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }


    async deleteASchoolAcademicSubject(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody} = await this.service.deleteAnAcademicSubject(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }
}




/******** SCHOOL SUBJECTS********/
export class SchoolAcademicCourseController{
    
    private courseService:ISchoolAcademicCourseSer;


    constructor(as:ISchoolAcademicCourseSer){
        this.courseService=as;
    }


    async addNewSchoolCourse(req:Request,res:Response,next:NextFunction){
        
        try{
        
            const {status,resBody}:serviceReturnType=await this.courseService.createNewCourse(req,res);
    
            res.status(status).json(resBody);
        } catch(err){
            next(err);
        }
    }

    async listAllSchoolAcademicCourses(req:Request,res:Response,next:NextFunction){
        try{

            const courses = await coursesModel.find().lean();
            const courses_meta = await coursesMetaModel.find().lean();

            res.status(200).json({message:"fetched Sucessfullly",success:true,error:null,data:{courses,courses_meta}});
        }catch(err){
            next(err);
        }
    }

    async getASchoolAcademicCourse(req:Request,res:Response,next:NextFunction){
        try{
            const {status,resBody}:serviceReturnType=await this.courseService.getAnAcademicCourse(req,res);
    
            res.status(status).json(resBody);
        } catch(err){
            next(err);
        }
    }


    async editASchoolAcademicCourse(req:Request,res:Response,next:NextFunction){
        try{

            const {status,resBody} = await this.courseService.updateAcademicCourse(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }



    async deleteASchoolAcademicSubject(req:Request,res:Response,next:NextFunction){
        try{
            const {status,resBody} = await this.courseService.deleteAnAcademicCourse(req,res);

            res.status(status).json(resBody);
        }catch(err){
            next(err);
        }
    }
}