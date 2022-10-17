import { paymentDal } from "../dal/index.dal";
import { iPayment } from "../interfaces/index.interface";

export default {
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