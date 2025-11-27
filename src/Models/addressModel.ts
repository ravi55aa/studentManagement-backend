import { Types,model,Schema } from "mongoose";

export interface AddressInterface {
    userId: Schema.Types.ObjectId;   
    userType: "admin" | "teacher" | "student";
    street: string;
    city: string;
    state: string;
    zip: string;
    country:string
}




const AddressSchema = new Schema<AddressInterface>(
    {
        userId: { type: Types.ObjectId, required: true, refPath: "userType" },

        userType: {
        type: String,
        required: true,
        enum: ["admin", "teacher", "student"],
        },

        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },

        zip: { type: String, required: true }
    },
    { timestamps: true }
);

const AddressModel = model<AddressInterface>("Address", AddressSchema);

export default AddressModel;
