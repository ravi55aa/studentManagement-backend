import { Document,model,Schema } from "mongoose";

export interface ISuperAdmin extends Document {
    name: string | null;
    email: string;
    password:string
}

const superAdminSchema = new Schema<ISuperAdmin>(
    {
        name: {
        type: String,
        required: true,
        trim: true,
        },

        email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        },

        password: {
        type: String,
        required: true,
        }
    }
);

const superAdminModel = model<ISuperAdmin>('SuperAdmin', superAdminSchema);
export default superAdminModel;