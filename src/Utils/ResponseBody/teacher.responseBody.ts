import { StatusCodes } from "../../Constants/statusCodes";
import { IResponse } from "../../Interfaces/IResponse";
import { IGetAllTeachers } from "../../Interfaces/Other/getAllTeachers";
import { ITeacher, ITeacherBio } from "../../Models/teacherModel";

//Argument of type 'T' is not assignable to parameter of type 'object'
// T = string
// T = number
// T = null
// T = boolean


export class TeacherResponseBody
{
    static createTeacher<T>(docs: T|null) {
        
        let fields=0; 
        if(docs){
            fields= Object.keys(docs).length;
        }
    
        const responseBody: IResponse<T | null> = {
            success: fields > 0,
            data: fields ? docs : null,
            error: fields ? null : "No records found",
            message: fields
            ? "Records fetched successfully"
            : "No records available",
        };

        return {
            status: fields
            ? StatusCodes.OK
            : StatusCodes.NOT_FOUND,
            resBody: responseBody,
        };
    }
    

    static getAllTeachers=(docs:IGetAllTeachers)=>{
        const {teachersSchoolData}=docs; 
        const fields=Object.keys(teachersSchoolData).length>0;
    
        const responseBody: IResponse<IGetAllTeachers | null> = {
            success: fields ,
            data: fields ? docs : null,
            error: fields ? null : "No teachers found",
            message: fields
            ? "Records fetched successfully"
            : "No records available",
        };

        return {
            status: fields
            ? StatusCodes.OK
            : StatusCodes.NOT_FOUND,
            resBody: responseBody,
        };
    }


}




