import mongoose, { Document } from "mongoose";

export interface ISchool extends Document {
    userId?: mongoose.Types.ObjectId;
    adminName: string|undefined;
    schoolName: string|undefined;
    email: string|undefined;
    password: string|undefined;
    profile?: any|undefined;
    phone?: string|undefined;
}


const schoolMeta = new mongoose.Schema<ISchool>(
        {
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
        required: true,
        },

        adminName: {
        type: String,
        required: [true, "Admin name is required"],
        minlength: [2, "Name too short"],
        },

        schoolName: {
        type: String,
        required: [true, "School name is required"],
        minlength: [2, "Name too short"],
        },

        email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email"],
        },

        password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be 6+ characters"],
        maxlength: [8, "Password must not be greater than 8 characters"],
        },

        profile: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
        },

        phone: {
        type: String,
        match: [/^[6-9]\d{9}$/, "Enter valid 10 digits number"],
        }
    },
    { timestamps: true }
);


export default mongoose.model("school",schoolMeta );
