/// <reference path="./types/express/index.d.ts" />

import express from "express";
import { Response,Request } from "express";
const app=express();

import cookieParser from "cookie-parser";
import handleErrorsMiddleware from "./Middlewares/error.middleware";

import {env,sessionConfig,connectDB} from "./Config/index";
import {oauthRouter,authRouter,schoolRouter} from "./Routes/index"; 
import cors from "cors";


app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
)
app.use(cookieParser());
app.use(sessionConfig());  
app.use(express.json());
app.use(express.urlencoded({extended:true}));

connectDB();

app.use("/google",oauthRouter);
app.use("/auth",authRouter);
app.use("/school",schoolRouter);
app.get("/",(req:Request,res:Response)=>{
    return res.status(200).json({mission:"success",message:"Sever is running"});
});



app.use(handleErrorsMiddleware); 

app.listen(env.PORT,()=>{
    console.log(`http://localhost:${env.PORT}`);
});