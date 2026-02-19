import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export enum FeeType {
    COURSE = "COURSE",
    ANNUAL = "ANNUAL",
    EXAM = "EXAM",
    CENTER = "CENTER",
    OTHER = "OTHER"
}


export interface IFee extends Document {
        name: String | null;
        code: String | null;
        status: String | null;
        totalAmount: Number | null;
        dueDate: Date | null;
        currency: String | null;
        isDeleted:Boolean | null;
        
        type:FeeType|null,
        appliesTo: {
            model:String,
            id:ObjectId
        }

        tenantId: ObjectId | null;
        autoReminder: {
            daysBeforeDue: Number | null;
            enabled: Boolean | null;
        };
    }

    


const FeesSchema = new Schema<IFee>({
    name: { type: String },
    code: { type: String },
    tenantId: { type: Schema.Types.ObjectId },
    currency: { type: String },
    status: { type: String },
    dueDate: { type: Date },
    type: { type:String, enum: Object.values(FeeType),
        required: true },
    appliesTo: {
        model: {
            type: String,
            enum: ["Course", "School", "Exam", "Center"],
            required: true
        },
        id: {
            type: Schema.Types.ObjectId,
            required: true
        }
    },
    totalAmount: { type: Number },
    isDeleted:{type:Boolean,default:false},
    autoReminder: {
        daysBeforeDue: { type: Number },
        enabled: { type: Boolean },
    },
});


const feeModel = mongoose.model<IFee>('Fees', FeesSchema);

export default feeModel;




