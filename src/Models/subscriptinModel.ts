import mongoose,{Document,Schema,Types} from "mongoose";

export interface ISubscription extends Document {
    schoolId: Types.ObjectId;

    planId: Types.ObjectId;

    amount: number;
    discount: number;
    discountAmount: number;
    finalAmount: number;

    startDate: Date;
    endDate: Date;

    status: "active" | "expired" | "cancelled" | "pending";

    paymentStatus: "paid" | "unpaid" | "failed";

    transactionId?: string;
    paymentMethod?: string;

    autoRenew: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
    {
        schoolId: {
        type: Schema.Types.ObjectId,
        ref: "School",
        required: true,
        },

        planId: {
        type: Schema.Types.ObjectId,
        ref: "Plan",
        required: true,
        },

        amount: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        discountAmount: { type: Number, default: 0 },
        finalAmount: { type: Number, required: true },

        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },

        status: {
        type: String,
        enum: ["active", "expired", "cancelled", "pending"],
        default: "pending",
        },

        paymentStatus: {
        type: String,
        enum: ["paid", "unpaid", "failed"],
        default: "unpaid",
        },

        transactionId: {
            type:String,
            default:'null'
        },
        
        paymentMethod: {
            type:String,
            default:'Stripe'
        },

        autoRenew: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const subscriptionModel = mongoose.model<ISubscription>(
    "Subscription",
    subscriptionSchema
);