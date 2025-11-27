import {model,Schema,Document} from "mongoose";

export interface IUser extends Document {
    name: string | null;
    email: string ;
    password: string | null;
    phone: string | null;
}

const adminSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true },
    },
    { timestamps: true }
);

let userModel=model<IUser>("admin",adminSchema);
export default userModel;