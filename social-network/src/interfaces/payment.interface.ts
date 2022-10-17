import { Types } from "mongoose";

interface iPayment {
    _id?: Types.ObjectId,
    stripeId: string,
    paymentEmail: string,
    paymentName: string,
    status: string,
    method: string,
    currency: string,
    amountPaid: number,
    userId?: {
        type: Types.ObjectId,
        ref: "users",
    },
    paymentDate?: Date,
    updatedAt?: Date
}

export default iPayment;