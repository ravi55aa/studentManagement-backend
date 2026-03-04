// src/types/express/index.d.ts

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId?: string;
        tenantId?: string;
        role?: string;
        [key: string]: unknown;
      };
    }
  }
}

export {};

// interface UserPayload {
//       userId: string;
//       role: string;
//       tenantId?: string;
//     }

//     interface Request {
//       user?: UserPayload;
//     }
