import { StatusCodes } from '../../Constants/statusCodes';
import { IResponse } from '../../Interfaces/IResponse';

export class SchoolResponseBody {
  //     static newAcademicYear(newDoc:Partial<IAcademicYear|null>){

  //         const responseBody:IResponse<Partial<IAcademicYear|null>>={
  //             success:newDoc?true:false,
  //             data:newDoc?newDoc:null,
  //             error:newDoc?null:"something went wrong, cant add AcademicYear",
  //             message:newDoc?"New Batch Added Successfully":"Cant add Batch"
  //         }

  //         return {
  //             status:
  //             newDoc?
  //             StatusCodes.OK:
  //             StatusCodes.INTERNAL_SERVER_ERROR,resBody:responseBody};
  //     }

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
  static newDocument<T>(
    doc: T | null,
    error: string,
    message: string,
    errMessage: string,
    statusCode: number,
  ) {
    const responseBody: IResponse<Partial<T | null>> = {
      success: doc ? true : false,
      data: doc ? doc : null,
      error: doc ? null : error,
      message: doc ? message : errMessage,
    };

    return {
      status: doc ? statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
      resBody: responseBody,
    };
  }

  static forUpdate<T>(
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
}

// class UpdatesResponseBody{
//     static ofDocument<T>(doc:T|null){
//         const status=doc?StatusCodes.CREATED:StatusCodes.CONFLICT;

//         const resBody:IResponse<T|null>={
//             success:status==201?true:false,
//             data:doc,null,
//             error:status==201?null:"Something went error",
//             message:status==201?"Fetched":"Not-fetched",
//         }

//         return {status,resBody};
//     }
// }
