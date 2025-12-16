// src/types/express/index.d.ts
    declare namespace Express {
    export interface Request {
        user?: {
        userId?: string;
        tenantId?: string;
        role?: string;
        [key: string]: any;
        };
    }
}
