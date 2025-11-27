import mongoose from "mongoose";

const mongoDB=async()=>{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017//secondProject");
        console.info("[Database] connected 📊🔐");
    } catch(err:any){
        throw new Error(err.message);
    }
}

export default mongoDB;