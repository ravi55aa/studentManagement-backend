import { Request,Response,NextFunction } from "express";
import { verifyToken,refreshAccessToken } from "../Utils/jwt";
import { env } from "../Config";
import handleErrorsMiddleware from "./error.middleware";

export const authMiddleware = 
    async (req: Request, res: Response, next: NextFunction) => {
    try {


        const token = req.cookies.token; //expired token back-listing
        
        try {
            const decoded = 
                verifyToken(token, env.JWT_ACCESS_TOKEN_SECRET);
            req.user = decoded;

            return next();

        } catch (err) {
            console.log("Access token expired or invalid");
        }



        const refreshToken = req.session.refreshToken;
        if (!refreshToken) {
        throw new Error("No refresh token, user not authenticated");
        }



        const newToken = await refreshAccessToken(refreshToken);
        if (!newToken) throw new Error("Refresh token invalid");
        res.cookie("token", newToken, {
        httpOnly: true,
        maxAge: 2 * 60 * 1000, 
        });



        const decoded = verifyToken(newToken, env.JWT_ACCESS_TOKEN_SECRET);
        req.user = decoded;
        
        console.log("NewTokenGenerated🆕🎫")
        next();


    } 
    catch (err: any) {
        console.log("AUTH MIDDLEWARE ERROR:", err.message);
        return handleErrorsMiddleware(err, req, res, next);
    }
};

