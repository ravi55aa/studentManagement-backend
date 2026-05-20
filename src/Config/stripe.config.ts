
import Stripe from 'stripe';
import dotenv from 'dotenv';

import env from './env.config';

dotenv.config();

export const stripe = new Stripe(env.STRIPE_SECRET_KEY!);
