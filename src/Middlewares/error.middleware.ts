import { NextFunction, Request,Response } from "express";

const handleErrorsMiddleware=(err:Error,req:Request,res:Response,next:NextFunction)=>{
    
    if (res.headersSent) {
        return next(err); // let Express handle it
    }

    
    if(req.statusCode==401){
        return res.status(401).json(
            {description:"Un_Authorized",
                error:err,
                message:err.message
            });
    }

    const status = res.statusCode !== 200 ? res.statusCode : 500;

    res.status(status).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: err,
    });
}

export default handleErrorsMiddleware;
