import { NextFunction, Request,Response } from "express";
import { IUserAuthService } from "../Interfaces/services/IAdminAuthService";
import { StatusCodes } from "../Contants/statusCodes";

export class UserAuthController{
    
    private authService: IUserAuthService;
    constructor(authService: IUserAuthService){
        this.authService=authService
    }

    public async register(req:Request, res:Response,next:NextFunction){
        try{
            const userData=req.body;
            const newUser=await this.authService.registerUser(userData);

            return res.status(StatusCodes.CREATED).json({ 
                success: true, 
                message: "User created successfully",
                data: { id: newUser._id, email: newUser.email },
                error:null
            });

        } catch(err:any){
            next(err);
        }
    }
}