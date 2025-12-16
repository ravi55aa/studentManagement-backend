import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../Constants/statusCodes";

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized. No user found.",
                data: null,
                error: "NoUser"
            });
        }

        if (!roles.includes(user.role)) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "Access denied. Insufficient permissions.",
                data: null,
                error: "Forbidden"
            });
        }

        next();
    };
};
