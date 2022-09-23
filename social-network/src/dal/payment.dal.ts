import { Payment } from "./models/index.model";
import { iPayment } from "../interfaces/index.interface";

export default {
    createPayment: async (reqPayment: iPayment): Promise<iPayment> => {
        try {
            const newPayment = new Payment(reqPayment);
            const payment: iPayment = await newPayment.save();
            return payment;
        } catch (error) {
            throw error;
        }
    },

    isAlreadyPaid: async (userId: string): Promise<iPayment> => {
        try {
            const payment = await Payment.findOne({ userId: userId });
            return payment;
        } catch (error) {
            throw error;
        }
    }
}