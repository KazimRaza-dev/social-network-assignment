import { Request, Response, NextFunction } from "express";
import Stripe from 'stripe';
import { userAuthRequest } from "../interfaces/index.interface";
import { paymentService } from "../services/index.service";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-08-01'
});

export default {
    createCheckoutSession: async (req: userAuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.user._id;
            const isPaid = await paymentService.isAlreadyPaid(userId);
            if (isPaid) {
                return res.status(400).send({ message: "You have already paid for social Feed." })
            }
            const session = await paymentService.createStripeSession(userId);
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
            res.status(200).send({ message: paymentSuccess.message });
        } catch (error) {
            next(error);
        }
    },

    paymentFailed: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(400).send({ message: "Payment failed. Make correct payment in order to access social feed." });
        } catch (error) {
            next(error);
        }
    }
}