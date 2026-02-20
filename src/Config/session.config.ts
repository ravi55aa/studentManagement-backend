import session from 'express-session';
import env from './env.config';


const sessionConfig=()=>{
    return session({
    secret:env.SESSION_SECRET!,
    resave:false,
    saveUninitialized:false,
    cookie: {
        httpOnly: true,
        secure: false,       // true in production (HTTPS)
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 //maxTime
    },
    });
}

export default sessionConfig;
