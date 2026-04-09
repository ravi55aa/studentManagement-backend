import mongoose, { Schema, Document } from "mongoose";

export interface IPlan extends Document {
    name: string;
    description?: string;

    amount: number;
    discount?: number; // percentage
    discountAmount?: number;

    finalAmount: number;

    duration: number; // in days (30, 90, 365)

    benefits: string[];

    maxStudents?: number;
    maxTeachers?: number;

    isActive: boolean;
    isPopular: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
    {
        name: { type: String, required: true },
        description: String,

        amount: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        discountAmount: { type: Number, default: 0 },
        finalAmount: { type: Number, required: true },

        duration: { type: Number, required: true },

        benefits: [{ type: String }],

        maxStudents: Number,
        maxTeachers: Number,

        isActive: { type: Boolean, default: true },
        isPopular: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const planModel = mongoose.model<IPlan>("Plan", planSchema);