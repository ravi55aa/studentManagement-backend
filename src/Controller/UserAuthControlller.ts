import { NextFunction, Request,Response } 
    from "express";
import { IUserAuthService } 
    from "../Interfaces/services/IAdminAuthService";
import { StatusCodes } 
    from "../Constants/statusCodes";
import {IResponse} 
    from "../Interfaces/IResponse"
import { IUser } 
    from "../Models/userModel";
import { jwtTokensGenerator } 
    from "../Utils/jwt";
import { AuthUserDTO } 
    from "../dto/userAuth.dto";
import { handleResponseBody } 
    from "../Utils/responseBody";



export class UserAuthController{
    
    private authService: IUserAuthService;
    
    constructor(authService: IUserAuthService){
        this.authService=authService
    }



    public async register(req:Request, res:Response,next:NextFunction):Promise<void> {
        try{
            
            const {userSchema,addressSchema}=AuthUserDTO.register(req);

            const newUser=
            await this.authService.register(userSchema,addressSchema);


            //jwt *********
            const {token,refreshToken}=jwtTokensGenerator(newUser);
            

            res.cookie("token",token,
                {httpOnly:true,maxAge:2*60*1000,path:"/"}
            );

            req.session.refreshToken=refreshToken;

            res
            .status(StatusCodes.CREATED)
            .json(
                { 
                success: true, 
                message: "User created successfully",
                data: { id: newUser._id, email: newUser.email },
                error:null
                }
            );

        } catch(err:any){
            next(err);
        }
    }



    public async signIn(req:Request,res:Response,next:NextFunction):Promise<void>{
        try{
            const signInUser:IUser|null=
                await this.authService.signIn(req.body);

                const responseBody:IResponse<IUser|null>=handleResponseBody(signInUser,res,req);

                
            let status=signInUser?StatusCodes.OK:StatusCodes.NOT_FOUND;
            res
            .status(status)
            .json(responseBody);

        } catch(err:any) {
            next(err);
        }
    }
}

