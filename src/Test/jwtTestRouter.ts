// let router=require('express').Router();
// import { Request,Response } from "express";
// import {generateAccessToken,generateRefreshToken,verifyToken,refreshAccessToken} from "../Utils/jwt";

// interface IJwt{
//     userId:string;
//     role:string,
//     tenantId:null|string
// }

// const dummyObj={
//     userId:new ObjectId"12345",
//     email:"rachouhan58@gmail.com",
//     role:"superAdmin"
// }

// import env from "../Config/env.config";

// router.post("/login",(req:Request,res:Response)=>{
//     const token=generateAccessToken(dummyObj);
//     const refreshToken=generateRefreshToken(dummyObj);

//     res.cookie("refreshToken",refreshToken,{
//         httpOnly:true,
//         domain:"localhost",
//         maxAge:1*60*60*1000, //1h,
//         path:"/",
//     });

//     res.cookie('token',token,{
//         httpOnly:true,
//         domain:"localhost",
//         maxAge:2*60*1000, //10sec
//         path:"/"
//     });

//     res.status(201).json({mission:"success",message:"Login successful"});
// })

// router.get("/isExpired",(req:Request,res:Response)=>{
    
//     const token:string=req.headers.authorization?.split(" ")[1]||req.cookies.token;
//     const refreshToken:string=req.cookies.refreshToken;
    
//     const verify=verifyToken(token,env.JWT_ACCESS_TOKEN_SECRET);
    
//     if(!verify){
//         const newToken=refreshAccessToken(refreshToken.trim(),dummyObj);

//         res.cookie('token',newToken,{
//             httpOnly:true,
//             domain:'localhost',
//             maxAge:60*1000,
//             path:"/"
//         });

//         return res.status(201).json({mission:"good",message:'new Token generated'});
//     }

//     console.log("good token😁")
//     return res.status(200).json({mission:"success",message:'Authorized'});
// })


// router.get("/home",(req:Request,res:Response)=>{
//     res.status(200).json({mission:"Success",message:"getHome"});
// })

// module.exports=router;
