import env from "./env.config";
import {Request,Response} from "express";
import axios,{AxiosResponse} from "axios";

const REDIRECT_URI = 'http://localhost:4000/google/auth/callback';



export const handleOAuth=(req:Request,res:Response)=>{
    let state="someRandomId"
    //req.session.oauthState=state;

    const authUrl=new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id',env.GOOGLE_CLIENT_ID)
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'profile email');
    authUrl.searchParams.set('state', "someRandomId");
    //authUrl.searchParams.set('access_type', 'offline');

    res.redirect(authUrl.toString());
}



export const handleAuthCallback=async(req:Request,res:Response)=>{
    const {code} = req.query;

    // if(state!==req.session.oauthState){
    //     return res.status(400).send("State parameter mismatch");
    // }

    try{
        const tokenResponse:AxiosResponse<any> =await axios.post("https://oauth2.googleapis.com/token",new URLSearchParams({
                client_id:env.GOOGLE_CLIENT_ID,
                client_secret:env.GOOGLE_CLIENT_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: REDIRECT_URI,
                code:String(code)
            }),{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        const { access_token, id_token } = await tokenResponse.data;



        const userInfo:AxiosResponse<any> = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', 
            {
            headers: { Authorization: `Bearer ${access_token}` }
            }
        );


        const user = {
        id: userInfo.data.sub,
        email: userInfo.data.email,
        name: userInfo.data.name,
        picture: userInfo.data.picture
        };
        //req.session.user = user;
        res.redirect('http://localhost:5173/createSchool'); 

        
    } catch (error:any) {
        console.error('OAuth callback error:', error.response?.data || error.message);
        res.status(500).send('Authentication failed. Please try again.');
    }
}
