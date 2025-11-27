import session from 'express-session';
import env from './env.config';

const sessionConfig=()=>{
    return session({
    secret:env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    });
}

export default sessionConfig;
