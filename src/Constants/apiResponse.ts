import { StatusCodes } from './statusCodes';

export class ApiResponse {
  static success<T>(data: T, message = 'Success') {
    return {
      status: StatusCodes.OK,
      resBody: {
        success: true,
        data,
        error: null,
        message,
      },
    };
  }

  static unAuthorized(message = 'User unauthorized') {
    return {
      status: StatusCodes.UNAUTHORIZED,
      resBody: {
        success: true,
        data: null,
        error: null,
        message,
      },
    };
  }

  static noContent(message = 'No content') {
    return {
      status: StatusCodes.NO_CONTENT,
      resBody: {
        success: true,
        data: null,
        error: null,
        message,
      },
    };
  }

  static created<T>(data: T) {
    return {
      status: StatusCodes.CREATED,
      resBody: {
        success: true,
        data,
        error: null,
        message: 'Created Successfully',
      },
    };
  }

  static notFound(message = 'Resource not found') {
    return {
      status: StatusCodes.NOT_FOUND,
      resBody: {
        success: false,
        data: null,
        error: message,
        message,
      },
    };
  }

  static failure(message = 'Something went wrong') {
    return {
      status: StatusCodes.BAD_REQUEST,
      resBody: {
        success: false,
        data: null,
        error: message,
        message,
      },
    };
  }

  static badRequest(message = 'Bad Request') {
    return {
      status: StatusCodes.BAD_REQUEST,
      resBody: {
        success: false,
        data: null,
        error: 'BAD_REQUEST',
        message,
      },
    };
  }
}
