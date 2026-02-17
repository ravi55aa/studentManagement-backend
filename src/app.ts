/// <reference path="./types/express/index.d.ts" />

import express from "express";
const app=express();

import cookieParser from "cookie-parser";
import handleErrorsMiddleware from "./Middlewares/error.middleware";

import {sessionConfig,connectDB} from "./Config/index";
import cors from "cors";

import {
    oauthRouter,authRouter,
    schoolRouter,addressRouter,
    documentsRouter,
    resetPassword,
    teacherRouter,
    notificationRouter,
    stripeRouter
    } from "./Routes/index"; 



app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST","PATCH", "PUT", "DELETE"],
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
app.use("/address",addressRouter);
app.use("/documents",documentsRouter);
app.use("/password",resetPassword);
app.use("/teacher",teacherRouter);
app.use("/notification",notificationRouter);
app.use("/stripe",stripeRouter);


app.use((req, res) => {
    console.error("❌ Route not found:", req.method, req.originalUrl);
    res.status(404).json({ message: "Route not found" });
    });



app.use(handleErrorsMiddleware); 

export default app;