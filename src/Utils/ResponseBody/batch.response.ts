import { StatusCodes } from '../../Constants/statusCodes';
import { IResponse } from '../../Interfaces/Other/IResponse';
import { IBatches } from '../../Models/batchModel';

export class BatchResponseBody {
  static createBatch(newCenterDoc: Partial<IBatches | null>) {
    const responseBody: IResponse<Partial<IBatches | null>> = {
      success: newCenterDoc ? true : false,
      data: newCenterDoc ? newCenterDoc : null,
      error: newCenterDoc ? null : 'something went wrong, cant add center',
      message: newCenterDoc ? 'New Batch Added Successfully' : 'Cant add Batch',
    };

    return {
      status: newCenterDoc ? StatusCodes.OK : StatusCodes.INTERNAL_SERVER_ERROR,
      resBody: responseBody,
    };
  }
}
