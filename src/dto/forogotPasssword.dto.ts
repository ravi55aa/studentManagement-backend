import { Request } from 'express';

import { UserRole } from '../types/auth.types';

export class ForgotPasswordDTO {
  static verifyEmail(req: Request) {
    const { email, model } = req.body;
    if (typeof email !== 'string' || typeof model !== 'string') {
      throw new Error('invalid query type');
    }

    return { email, model };
  }

  static changePassword(req: Request): { id: string; password: string; role: UserRole } {
    const { password1, password2, role } = req.body;
    const { id } = req.params;

    if (!id || !role) {
      throw new Error('id or role is missing');
    }

    if (password1 !== password2) {
      throw new Error("Passwords are'nt matching");
    }

    return { role: role, id, password: password1 };
  }
}
