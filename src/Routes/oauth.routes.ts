import { Router } from 'express';
const router = Router();
import { handleOAuth, handleAuthCallback } from '../Config/oAuth.config';

router.get('/auth', handleOAuth);

router.get('/auth/callback', handleAuthCallback);

export default router;
