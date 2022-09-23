import { paymentDal } from "../dal/index.dal";
import { iPayment } from "../interfaces/index.interface";
import Stripe from 'stripe';
import { config } from "dotenv";
config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-08-01'
});

export default {
    createStripeSession: async (userId: string): Promise<Stripe.Response<Stripe.Checkout.Session>> => {
        try {
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
            return session;
        } catch (error) {
            throw error;
        }
    },

    createPayment: async (session, userId) => {
        try {
            const newPayment: iPayment = {
                stripeId: session.id, paymentEmail: session.customer_details.email,
                paymentName: session.customer_details.name, method: session.payment_method_types[0],
                status: session.payment_status, currency: session.currency, amountPaid: session.amount_total / 100, userId: userId
            };
            await paymentDal.createPayment(newPayment);
            const paymentSuccess = {
                message: "Payment successfully submitted. Now you can enjoy social feed.",
            }
            return paymentSuccess;
        } catch (error) {
            throw error;
        }
    },

    isAlreadyPaid: async (userId: string): Promise<boolean> => {
        try {
            const payment: iPayment = await paymentDal.isAlreadyPaid(userId);
            if (!payment) {
                return false;
            }
            return true;
        } catch (error) {
            throw error;
        }
    }
}