
import { Request,Response } 
    from "express";
import { ISchool } 
    from "../Models/schoolModel";
import { FilterQuery } 
    from "mongoose";
import { handleTokenVerification } from "../Utils/jwt";
import { IAcademicCourse, IAcademicCourseMeta, IUpload_document } from "../Models/courses.model";
import { IAcademicSubject } from "../Models/academicYear";
import { batchModel } from "../Models/batchModel";
import { IDocument, IUploadedDoc } from "../Models/documentModel";


export class SchoolDTO{


        static createSchool(reqBody:Partial<ISchool>):Partial<ISchool>{
            const{
                adminName,
                schoolName,   
                email,
                password,
                profile,
                phone
            } = reqBody;
            
            return {
                adminName,
                schoolName,
                email,
                password,
                profile,
                phone};
        }



        static getSchool(req:Request,res:Response):FilterQuery<Partial<ISchool>>{
            const {schoolName,password}=req.query;
            const decoded = handleTokenVerification(req, res);
            
            const query={
                schoolName:schoolName,
                password:password,
                userId:decoded.userId
            }

            return query;
        }


        static updateSchool(req:Request,res:Response):{id:string,dtoData:Partial<ISchool>}{
            
            const {id} = req.params;
            
            if(!id){
                throw new Error("School Id is not found");
            }

            let {
                adminName,
                schoolName,
                profile,
                phone,
            } = req.body;

            if(req.file){
                console.log("@schoolDTO req.file",req.file)
                profile=req.file.path;
            }

            handleTokenVerification(req,res);

            const dtoData: Partial<ISchool> = {};

            if (adminName !== undefined)
                dtoData.adminName = adminName;

            if (schoolName !== undefined)
                dtoData.schoolName = schoolName;

            if (profile !== undefined)
                dtoData.profile = profile;

            if (phone !== undefined)
                dtoData.phone = phone;

            return {id,dtoData};
        }

    }


/**
 * Shool Academic Year
 */
export class SchoolAcademicYearDto{


        static addNewYear(req:Request,res:Response){
            const {
                code,startDate,endDate,year,status
            } = req.body;

            const decoded=handleTokenVerification(req,res)
            const dtoData={
                code,startDate,endDate,
                year,status,
                adminId:decoded.userId,
                tenantId:decoded.tenantId,
            }

            return dtoData;
        }


        static  getTenantId(req:Request,res:Response){
            const decoded= handleTokenVerification(req,res);

            const dtoData={
                adminId:decoded.userId,
                tenantId:decoded.tenantId,
            }

            return dtoData;
        }


        static updateAcademicYear(req: Request, res: Response) {
            const {
                code,
                startDate,
                endDate,
                status,
                year
            } = req.body;

            const decoded = handleTokenVerification(req, res);

            const updateYearDto= {
                ...(code !== undefined && { code }),
                ...(startDate !== undefined && { startDate }),
                ...(year !== undefined && { year }),
                ...(endDate !== undefined && { endDate }),
                ...(status !== undefined && { status }),

                adminId: decoded.userId,
                tenantId: decoded.tenantId
            };

            return updateYearDto;
        }

}



/**
 * School Subjects dto
 */

export class SchoolSubjectsDto{
    static async addNewSubject(req:Request,res:Response){
            const {
                code,name,className,level,type,status,
                startDate,endDate,academicYear,department,batchesToFollow,
                maxMarks,passMarks,credits,referenceBooks,description
            } = req.body;
            
            const decoded=handleTokenVerification(req,res);
            
            const dtoData={
                code,name,className,level,type,status,
                maxMarks,passMarks,credits,referenceBooks,description,
                startDate,endDate,academicYear,department,
                batchesToFollow:batchesToFollow.split(","),
                adminId:decoded.userId,
                tenantId:decoded.tenantId,
            }

            /**
             * batchesToFollow=batchCodes[];
             */

            const batchesToFollowArray=[];
            for(let code of batchesToFollow.split(",")){
                const isBatch=await batchModel.findOne({code:code});
                if(!isBatch) continue;

                batchesToFollowArray.push(isBatch._id);
            }
            dtoData.batchesToFollow=batchesToFollowArray;

            return dtoData;
        }


        static async updateSubject(req: Request, res: Response) {
                const {
                    code,
                    name,
                    className,
                    level,
                    type,
                    status,
                    startDate,
                    endDate,
                    academicYear,
                    department,
                    batchesToFollow,
                    maxMarks,
                    passMarks,
                    credits,
                    referenceBooks,
                    description
                } = req.body;

                const decoded = handleTokenVerification(req, res);

                const updateSubjectDto:IAcademicSubject = {
                    ...(code && { code }),
                    ...(name && { name }),
                    ...(className && { className }),
                    ...(level && { level }),
                    ...(type && { type }),
                    ...(status && { status }),

                    ...(startDate && { startDate }),
                    ...(endDate && { endDate }),

                    ...(academicYear && { academicYear }),
                    ...(department && { department }),

                    ...(batchesToFollow && { batchesToFollow }),

                    ...(maxMarks !== undefined && { maxMarks }),
                    ...(passMarks !== undefined && { passMarks }),
                    ...(credits !== undefined && { credits }),

                    ...(Array.isArray(referenceBooks) && { referenceBooks }),
                    ...(description && { description }),

                    adminId: decoded.userId,
                    tenantId: decoded.tenantId
                };

                const batchesToFollowArray=[];
                for(let batchCode of batchesToFollow.split(",")){
                    const isBatch=await batchModel.findOne({code:batchCode});
                    if(!isBatch) continue;

                    batchesToFollowArray.push(isBatch._id);
                }
                updateSubjectDto.batchesToFollow=batchesToFollowArray;
                
                return updateSubjectDto;
        }

    }



/**
 * School.Course
 */
export class SchoolCoursesDto{

    
    static addNewCourse(req:Request,res:Response){
            let {
                code,name,status,
                schedule,academicYear,batches,duration,
                description,maxStudents,enrollmentOpen,
                subjects,coordinators,eligibilityCriteria,
            } = req.body;
            console.log("dto course", req.body);
            
            const decoded=handleTokenVerification(req,res);
            const courseScheduleDates={
                endDate:schedule.endDate,
                startDate:schedule.startDate
            }
            const courseDurations={
                value:duration.value,
                unit:duration.unit
            }
            const courseDto={
                code,name,status,
                description,
                academicYear,
                schedule:courseScheduleDates,
                duration:courseDurations,
                adminId:decoded.userId,
                tenantId:decoded.tenantId,
            }
            

            let arrayOfAttachMents:IUpload_document[]=[];
            if(Array.isArray(req.files)){
                arrayOfAttachMents=req?.files?.map((ele)=>{
                    return {
                        fileName: ele.originalname || "SomeOne",
                        fileUrl: ele.path
                    }
                });
            }

            let s_subjects=subjects;
            subjects={
                subjectType:s_subjects[0]=="other"?"CUSTOM":"ACADEMIC",
                subjectRef:s_subjects,
                customSubjectName:s_subjects
            }

            const courseMetaDto={
                batches,
                attachments:arrayOfAttachMents,
                maxStudents,enrollmentOpen,subjects,
                coordinators,eligibilityCriteria
            }

            return {courseDto,courseMetaDto};
        }

    static updateCourse(req: Request, res: Response) {
            
        let {
                code,
                name,
                //level,
                status,
                schedule,
                academicYear,
                batches,
                duration,
                description,
                maxStudents,
                enrollmentOpen,
                subjects,
                coordinators,
                eligibilityCriteria
            } = req.body;

            const decoded = handleTokenVerification(req, res);

            const courseDto: Partial<IAcademicCourse> = {
                ...(code && { code }),
                ...(name && { name }),
                //...(level && { level }),
                ...(status && { status }),
                ...(description && { description }),
                ...(academicYear && { academicYear }),

                ...(schedule && {
                schedule: {
                    ...(schedule.startDate && { startDate: schedule.startDate }),
                    ...(schedule.endDate && { endDate: schedule.endDate })
                }
                }),

                ...(duration && {
                duration: {
                    ...(duration.value && { value: duration.value }),
                    ...(duration.unit && { unit: duration.unit })
                }
                }),

                adminId: decoded.userId,
                tenantId: decoded.tenantId
            };

            let arrayOfAttachMents: IUpload_document[] = [];

            if (Array.isArray(req.files)) {
                arrayOfAttachMents = req.files.map(ele => ({
                fileName: ele.originalname || "SomeOne",
                fileUrl: ele.path
                }));
            }

            let s_subjects=[...subjects];
            subjects=[{
                subjectType:s_subjects[0]=="other"?"CUSTOM":"ACADEMIC",
                subjectRef:s_subjects,
                customSubjectName:s_subjects 
            }]

            const courseMetaDto: Partial<IAcademicCourseMeta> = {
                ...(batches && { batches }),
                ...(arrayOfAttachMents.length && { attachments: arrayOfAttachMents }),
                ...(maxStudents !== undefined && { maxStudents }),
                ...(enrollmentOpen !== undefined && { enrollmentOpen }),
                ...(subjects && { subjects }),
                ...(coordinators && { coordinators }),
                ...(eligibilityCriteria && { eligibilityCriteria })
            };

            return { courseDto, courseMetaDto };
        }

}


/**
 * Documents
 */
export class DocumentsDto{


        static handleDtoOfDoc(req:Request):Partial<IDocument>{

                const files=req.files as Express.Multer.File[];
                const docs = files.map((f) => ({
                    url: f.path,
                    fileName: f.filename,
                }));
                
                return {
                    userId:req.user?.userId,
                    tenantId:req.user?.tenantId,
                    role:req.cookies.role || "School",
                    docs
                };
        }


        static updateDoc(req:Request,res:Response){

            const decoded=handleTokenVerification(req,res);

            const {docs}=this.handleDtoOfDoc(req);
            if(!docs || docs?.length <= 0){
                throw new Error("Nothing in the docs");
            }

            const role=req.headers.role;

            const dtoData:IUploadedDoc[]=docs

            const dtoQuery:FilterQuery<Partial<IDocument>>=
            {role:role,userId:decoded.userId};

            return {dtoData,dtoQuery};
        }

        static updateDocV2(req:Request,res:Response){

            const decoded=handleTokenVerification(req,res);
            const {userId}=req.params;

            const {docs}=this.handleDtoOfDoc(req);
            if(!docs || docs?.length <= 0){
                throw new Error("Nothing in the docs");
            }

            const role=req.headers.role;

            const dtoData:IUploadedDoc[]=docs

            const dtoQuery:FilterQuery<Partial<IDocument>>=
            {role:role,userId:userId};

            return {dtoData,dtoQuery};
        }


        static deleteDoc(req:Request,res:Response){
            // All kinds of documents removed here

            const {userId}=req.params;
            const {file_Name}=req.query;
            
            handleTokenVerification(req,res);

            const role=req.headers.role;

            const dtoQuery:FilterQuery<Partial<IDocument>>=
            {role:role,userId:userId,"docs.fileName":file_Name};

            return dtoQuery;
        }


        static removeOneDocument=(req:Request,res:Response)=>{
            /**
             * Destructure properties
             * HandleTokenVerification
             * Structure query
             * Return Structured_query
            */ 

            const {userId}=req.params;
            const {file_Name}=req.query;
    
            //handleTokenVerification(req,res);

            const role=req.headers.role;

            const filterQuery:FilterQuery<Partial<IDocument>>=
            {role:role,userId:userId};

            const pullQuery:FilterQuery<Partial<IDocument>>= {docs: { fileName: file_Name }};

            return {filterQuery:filterQuery,pullQuery:pullQuery};
        }

}