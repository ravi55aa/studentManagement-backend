import {config} 
    from "dotenv";

config();




const env:any={
    PORT:process.env.PORT ?? 4000,

    SESSION_SECRET:process.env.SESSION_SECRET,


    //*JWT
    JWT_ACCESS_TOKEN_SECRET:process.env.JWT_SECRET_KEY,
    JWT_TOKEN_EXPIRES_IN:process.env.JWT_TOKEN_EXPIRES_IN,
    JWT_REFRESH_TOKEN_EXPIRES_IN:process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    JWT_REFRESH_TOKEN_SECRET:process.env.JWT_REFRESH_TOKEN_SECRET_KEY,


    //*OAuth
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,


    //*CLOUDINARY
    CLOUD_NAME:process.env.CLOUD_NAME,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_KEY_SECRET:process.env.CLOUDINARY_API_KEY_SECRET,
}

export default env;
