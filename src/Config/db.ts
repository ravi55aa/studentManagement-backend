import mongoose from "mongoose";
import logger from "../Utils/logger";


const mongoDB=async()=>{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/secondProject");
        logger.info("[Database] connected 📊🔐");
    } catch(err){
        throw new Error("Database error",{cause:err});
    }
}

export default mongoDB;