import { ServerMessage } from "@Constants/resposeMessages";
import { StatusCodes } from "@Constants/statusCodes";

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}


export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, StatusCodes.NOT_FOUND);
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
        super(message, StatusCodes.BAD_REQUEST);
    }
}

export class FailureError extends AppError {
    constructor(message = 'Operation failed') {
        super(message, StatusCodes.BAD_REQUEST);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, StatusCodes.FORBIDDEN);
    }
}


export class InternalServerError extends AppError {
    constructor() {
        super(ServerMessage.ServerError, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}