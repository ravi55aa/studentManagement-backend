import {model, Types, Schema, Document, ObjectId } from 'mongoose';



export interface IBatches extends Document {
    tenantId: ObjectId | null;
    adminId: ObjectId | null;
    center: Types.ObjectId | null;
    academicYear: ObjectId | null;
    batchCounselor: ObjectId | null;

    name: String | null;
    code: String | null;
    status: String | null;
    course?: String | null;

    schedule: {
        endTime: String | null;
        startTime: String | null;
    };
}


const batchSchema = new Schema<IBatches>(
    {
        tenantId: {
        type: Types.ObjectId,
        ref: "School",
        default: null,
        },

        adminId: {
        type: Types.ObjectId,
        ref: "Admin",
        default: null,
        },

        name: {
        type: String,
        required: true,
        trim: true,
        },

        code: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        },

        center:{
            type:Types.ObjectId,
            ref:"Centers ",
            default:null
        },

        status: {
        type: String,
        enum: ["active", "inactive", "archived"],
        default: "active",
        },

        course: {
        type: String,
        trim: true,
        default: "School",
        },

        batchCounselor: {
        type: Types.ObjectId,
        ref: "User",
        default: null,
        },

        schedule: {
            startTime: {
                type: String,
                default: null,
            },
            endTime: {
                type: String,
                default: null,
            },
        },

        academicYear: {
        type: Types.ObjectId,
        ref: "AcademicYear",
        default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const batchModel = model<IBatches>("Batches", batchSchema);


