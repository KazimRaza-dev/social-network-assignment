import { Schema, Types, model, Model } from "mongoose";
import { iPayment } from "../../interfaces/index.interface";

const paymentSchema: Schema = new Schema<iPayment>({
    stripeId: {
        type: String,
        required: true,
    },
    paymentEmail: {
        type: String,
        required: true,
    },
    paymentName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    amountPaid: {
        type: Number,
        required: true,
    },
    method: {
        type: String,
        required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    }
}, {
    timestamps: {
        createdAt: 'paymentDate',
        updatedAt: 'updatedAt'
    }
})

const Payment: Model<iPayment> = model<iPayment>("payment", paymentSchema);
export default Payment;