import { model,Schema,Document} from "mongoose";

export interface IAddress extends Document {
    userId?: Schema.Types.ObjectId|undefined|string;   
    tenantId?:Schema.Types.ObjectId|string|undefined;
    userType?: "admin" | "teacher" | "student"|"school";
    street: string;
    city: string;
    state: string;
    zip: string;
    country:string;
}




export const AddressSchema = new Schema<IAddress>(
    {
        userId: { type: Schema.Types.ObjectId, required: false, refPath: "userType" },
        tenantId: { type: Schema.Types.ObjectId, required: false, refPath: "school" },
        userType: {
        type: String,
        required: false,
        enum: ["admin", "teacher", "student","school"],
        },

        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zip: { type: String, required: true }
    },
    { timestamps: true }
);

const AddressModel = model<IAddress>("Address", AddressSchema);

export default AddressModel;
