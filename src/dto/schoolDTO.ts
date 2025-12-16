
import { Request } from "express";
import { ISchool } 
    from "../Models/schoolModel";
import { FilterQuery } from "mongoose";

    export class SchoolDTO{
        static createSchool(reqBody:Partial<ISchool>):Partial<ISchool>{
            const{ 
                adminName,
                schoolName,
                email,
                password,
                profile,
                phone
            } = reqBody;
            
            return {
                adminName,
                schoolName,
                email,
                password,
                profile,
                phone};
        }



        static getSchool(req:Request):FilterQuery<Partial<ISchool>>{
            const {schoolName,password}=req.query;
            const query={
                schoolName:schoolName,
                password:password
            }

            return query;
        }
    }