
import mongoose, { Document } from "mongoose";







//*sub Schema

export interface IUploadedDoc {
    url: string;
    publicId: string;
}

const uploadedDocSchema = new mongoose.Schema<IUploadedDoc>(
    {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
    },
    { _id: false }
);








//*main Schema

export interface IDocument extends Document {
    tenantId?: mongoose.Types.ObjectId|string|undefined;
    userId?: mongoose.Types.ObjectId|string|undefined;
    role?: string|null;
    docs: IUploadedDoc[];
}

const documentSchema = new mongoose.Schema<IDocument>(
        {
        tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "school",
        required: false,
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "school",
            required: false,
        },
        role:{
            type:String,
            enum:["school","teacher","student","admin"],
            required:true,
            trim:true
        },
        docs:{
            type: [uploadedDocSchema],
            default: null,
        }

    },
    { timestamps: true }
);


export default mongoose.model<IDocument>("documents",documentSchema );
