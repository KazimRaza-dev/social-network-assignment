import { Request, Response, NextFunction } from "express";
import Stripe from 'stripe';
import { config } from "dotenv";
import { userAuthRequest } from "../interfaces/index.interface";
import { paymentService } from "../services/index.service";

config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-08-01'
});

export default {
    createCheckoutSession: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.user._id;
            const isPaid = await paymentService.isAlreadyPaid(userId);
            if (isPaid) {
                return res.status(400).send("You have already paid for social Feed.")
            }
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency: "USD",
                            product_data: {
                                name: "Payment for Social Feed",
                            },
                            unit_amount: 1200,
                        },
                        quantity: 1,
                    }
                ],
                success_url: `${process.env.STRIPE_SERVER_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&userId=${userId}`,
                cancel_url: `${process.env.STRIPE_SERVER_URL}/payment/failure`
            });
            res.json({ url: session.url })
        } catch (error) {
            next(error);
        }
    },

    paymentSuccess: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.query.userId as string;
            const sessionId: string = req.query.session_id as string;
            const session = await stripe.checkout.sessions.retrieve(sessionId)
            const paymentSuccess = await paymentService.createPayment(session, userId)
            res.status(200).send(paymentSuccess.message);
        } catch (error) {
            next(error);
        }
    },

    paymentFailed: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(400).send("Payment failed. Make correct payment in order to access social feed.");
        } catch (error) {
            next(error);
        }
    }
}