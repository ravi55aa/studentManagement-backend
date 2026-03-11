import mongoose, { Schema } from "mongoose";
import { IHomework } from "@Interfaces/model/Teacher/IHomework"; 
import { uploadedDocSchema } from "@Models/documentModel";

const homeworkSchema = new Schema<IHomework>(
    {
        title: {
        type: String,
        required: true,
        trim: true,
        },

        description: {
        type: String,
        required: true,
        },

        subjectId: {
        type: Schema.Types.ObjectId,
        ref: "AcademicSubjects",
        required: true,
        },

        batchId: {
        type: Schema.Types.ObjectId,
        ref: "Batches",
        required: true,
        },

        teacherId: {
        type: Schema.Types.ObjectId,
        ref: "TeacherBio",
        required: true,
        },

        status:{
            type:String,
            enum:["pending","submitted","reviewed"],required:true
        },

        dueDate: {
        type: Date,
        required: true,
        },
        
        attachments:{
            type:[uploadedDocSchema],
            default:null
        },

        isDelete:{
            type:Boolean,
            required:false,
            default:false
        },
    },
    { timestamps: true }
);

export const homeworkModel = mongoose.model<IHomework>(
    "Homework",
    homeworkSchema
);