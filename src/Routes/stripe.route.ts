import express, { Request,Response,NextFunction } from 'express';
import { stripeController } from '@DI/resolve';
// import { env } from "process";
// import schoolModel from "../Models/schoolModel";

const router = express.Router();

router.post('/create-payment-intent',
  (req:Request,res:Response,next:NextFunction)=>stripeController.createPaymentIntent(req,res,next));

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  (req:Request,res:Response)=>stripeController.callWebHook(req,res)
);

//example Subscription code
// router.post("/create-subscription", async (req, res) => {
//     const { priceId, userId } = req.body;

//     const user = await schoolModel.findById(userId);

//     let customerId = user.stripeCustomerId;

//     if (!customerId) {
//         const customer = await stripe.customers.create({
//         email: user.email,
//         });

//         customerId = customer.id;
//         user.stripeCustomerId = customerId;
//         await user.save();
//     }

//     const subscription = await stripe.subscriptions.create({
//         customer: customerId,
//         items: [{ price: priceId }],
//         payment_behavior: "default_incomplete",
//         expand: ["latest_invoice.payment_intent"],
//     });

//     res.json({
//         clientSecret:
//         subscription.latest_invoice?.payment_intent?.client_secret,
//     });
// });

export default router;
