import express from 'express';

import { stripe } from '../Config/stripe.config';
import logger from '../Utils/logger';
// import { env } from "process";
// import schoolModel from "../Models/schoolModel";

const router = express.Router();

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // convert to paisa/cents
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error, message: 'Payment failed' });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature']!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    logger.error(err);
    return res.status(400).send(`Webhook Error, ${err}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    //const paymentIntent = event.data.object;
    // console.log("Payment successful:", paymentIntent.id);
    // console.log("@stripe_route Payment intent success object:", paymentIntent);
    //! Update DB here
  }

  res.json({ received: true });
});

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
