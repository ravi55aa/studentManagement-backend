import { StatusCodes } from '../../Constants/statusCodes';
import { IResponse } from '../../Interfaces/Other/IResponse';
import { IAcademicYear } from '../../Models/academicYear';

export class AcademicYearResponseBody {
  //** YEAR */
  static newAcademicYear(newDoc: Partial<IAcademicYear | null>) {
    const responseBody: IResponse<Partial<IAcademicYear | null>> = {
      success: newDoc ? true : false,
      data: newDoc ? newDoc : null,
      error: newDoc ? null : 'something went wrong, cant add AcademicYear',
      message: newDoc ? 'New Batch Added Successfully' : 'Cant add Batch',
    };

    return {
      status: newDoc ? StatusCodes.OK : StatusCodes.INTERNAL_SERVER_ERROR,
      resBody: responseBody,
    };
  }

  static listAll<T>(docs: T[]) {
    const totalDocs = docs.length;

    const responseBody: IResponse<T[] | null> = {
      success: totalDocs > 0,
      data: totalDocs ? docs : null,
      error: totalDocs ? null : 'No records found',
      message: totalDocs ? 'Records fetched successfully' : 'No records available',
    };

    return {
      status: totalDocs ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      resBody: responseBody,
    };
  }

  //**SUBJECTS */
  static newAcademicModule<T>(
    doc: T | null,
    theError: string,
    theMessage: string,
    theMessageErr: string,
    statusCode: number,
  ) {
    const responseBody: IResponse<Partial<T | null>> = {
      success: doc ? true : false,
      data: doc ? doc : null,
      error: doc ? null : theError,
      message: doc ? theMessage : theMessageErr,
    };

    return {
      status: doc ? statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
      resBody: responseBody,
    };
  }

  static handleDeleteOneResBody<T>(doc: T | null) {
    const status = doc ? StatusCodes.CREATED : StatusCodes.CONFLICT;

    const resBody: IResponse<null> = {
      success: status == 201 ? true : false,
      data: null,
      error: status == 201 ? null : 'Something went error',
      message: status == 201 ? 'Fetched' : 'Not-fetched',
    };

    return { status, resBody };
  }

  //***COURSES */
  // static newAcademicCourse(doc:IAcademicSubject|null){
  //     const responseBody:IResponse<Partial<IAcademicSubject|null>>={
  //         success:doc?true:false,
  //         data:doc?doc:null,
  //         error:doc?null:"something went wrong, cant add AcademicYear",
  //         message:doc?"New Batch Added Successfully":"Cant add Batch"
  //     }

  //     return {
  //         status: doc ? StatusCodes.OK : StatusCodes.INTERNAL_SERVER_ERROR,
  //         resBody:responseBody
  //     };
  // }
}
