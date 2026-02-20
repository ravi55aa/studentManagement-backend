import mongoose, { Schema,ObjectId,Document } 
from "mongoose";




export interface ICenter extends Document{
    name:string|null,
    code:string|null,
    phone: string | null;
    email: string | null;
    tenantId:ObjectId|null,
    adminId:ObjectId|null,
    headInCharge:ObjectId|null,
    currentStrength: number | null;
    totalCapacity: number | null;
    isMain: boolean | null;
    isActive: boolean | null;
}



const CentersSchema: Schema = new Schema({
    name: { type: String,required:true,trim:true },

    code: { type: String,required:true },

    phone:{type:String,required:true},
    
    email:{type:String,required:true},
    
    tenantId: { type: Schema.Types.ObjectId,
    required:true,refPath:"School" },

    adminId: { type: Schema.Types.ObjectId,required:true,refPath:"Admin" },
    
    headInCharge: { type: Schema.Types.ObjectId,required:false,refPath:"Teacher" },
    
    totalCapacity: { type: Number,required:true },
    
    currentStrength: { type: Number,required:true },
    
    isMain: { type: Boolean,required:false,default:false},
    
    isActive: { type: Boolean,required:true },
},
{timestamps:true}  
);



const centerModel = mongoose.model<ICenter>('Centers', CentersSchema);
export default centerModel;




