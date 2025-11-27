import "express-session";

declare module "express-session" {
    interface Session {
        oauthState?: string;
        user?: any;
    }
}
