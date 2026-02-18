export class ApiResponse {
    static success<T>(data: T, message = "Success") {
        return {
        status: 200,
        resBody: {
            success: true,
            data,
            error: null,
            message,
        },
        };
    }

    static created<T>(data: T) {
        return {
        status: 201,
        resBody: {
            success: true,
            data,
            error: null,
            message:"Created Successfully",
        },
        };
    }

    static notFound(message = "Resource not found") {
        return {
        status: 404,
        resBody: {
            success: false,
            data: null,
            error: message,
            message,
        },
        };
    }

    static failure(message = "Something went wrong") {
        return {
        status: 400,
        resBody: {
            success: false,
            data: null,
            error: message,
            message,
        },
        };
    }

    static badRequest(message = "Bad Request") {
    return {
        status: 400,
        resBody: {
        success: false,
        data: null,
        error: "BAD_REQUEST",
        message,
        },
    };
    }
}