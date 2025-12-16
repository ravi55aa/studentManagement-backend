


import "express-session";

declare module "express-session" {
    interface SessionData {
        oauthState?: string;
        user?: any;
        refreshToken?:string|null;
    }
}
