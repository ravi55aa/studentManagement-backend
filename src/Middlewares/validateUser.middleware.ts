import { Request, Response, NextFunction } from "express";

import { StatusCodes } from "../Contants/statusCodes";
import { IResponse } from "../Interfaces/IResponse";
import { ZodSchema } from "zod";

export const validateUser =
    (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (err: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Unexpected validation error",
            error: String(err.issues),
            data: null,
        } as IResponse<null>)  ;
        }
    };
