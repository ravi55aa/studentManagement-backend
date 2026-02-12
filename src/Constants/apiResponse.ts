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
}