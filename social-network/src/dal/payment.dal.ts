import { Payment } from "./models/index.model";
import { iPayment } from "../interfaces/index.interface";

export default {
    /**
     * Create a new payment
     * 
     * @param reqPayment Payment object to be added
     * @returns New payment
     */
    createPayment: async (reqPayment: iPayment): Promise<iPayment> => {
        try {
            const newPayment = new Payment(reqPayment);
            return newPayment.save();
        } catch (error) {
            throw error;
        }
    },
    /**
     * Check whether a user has already paid or not
     * 
     * @param userId Id of a user
     * @returns Payment if it exists else null
     */
    isAlreadyPaid: async (userId: string): Promise<iPayment> => {
        try {
            return Payment.findOne({ userId: userId });
        } catch (error) {
            throw error;
        }
    }
}