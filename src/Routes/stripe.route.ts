import { Router} from "express";
import { stripe } from "../Config/stripe.config";

const router = Router();

router.post("/create-payment-intent", async (req, res) => {
    try {
        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // convert to paisa/cents
        currency: "inr",
        automatic_payment_methods: { enabled: true },
        });

        res.json({
        clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ message: "Payment failed" });
    }
});

export default router;
