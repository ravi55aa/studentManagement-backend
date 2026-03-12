import { IUploadedDoc,uploadedDocSchema } from "@Models/documentModel";
import { Schema, model, Document, Types } from "mongoose";

import { HomeworkSubmitStatus } from "../../types/homework";

export interface IHomeworkSubmission extends Document {
    studentId: Types.ObjectId;
    homeworkId: Types.ObjectId;
    note?: string;
    attachments?: IUploadedDoc[];
    links?: string[];
    status: HomeworkSubmitStatus;
    submittedAt: Date;
}



const HomeworkSubmissionSchema = new Schema<IHomeworkSubmission>(
    {
        studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
        },

        homeworkId: {
        type: Schema.Types.ObjectId,
        ref: "Homework",
        required: true,
        },

        note: {
        type: String,
        trim: true,
        },

        attachments: {
            type:[uploadedDocSchema],
            default:[]
        },
        links: [
        {
            type: String,
        },
        ],

        submittedAt: {
        type: Date,
        default: Date.now,
        },

        status: {
        type: String,
        enum: ["pending", "verified", "repeat", "submitted"],
        default: "pending",
        },
    },
    { timestamps: true }
);

HomeworkSubmissionSchema.index(
    { studentId: 1, homeworkId: 1 },
    { unique: true }
);

export const homeworkSubmissionModel = model<IHomeworkSubmission>(
    "HomeworkSubmission",
    HomeworkSubmissionSchema
);