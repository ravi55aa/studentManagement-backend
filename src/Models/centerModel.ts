import mongoose, { Schema,ObjectId,Document } 
from "mongoose";




export interface ICenter extends Document{
    name:String|null,
    code:String|null,
    phone: String | null;
    email: String | null;
    tenantId:ObjectId|null,
    adminId:ObjectId|null,
    headInCharge:ObjectId|null,
    currentStrength: Number | null;
    totalCapacity: Number | null;
    isMain: Boolean | null;
    isActive: Boolean | null;
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




