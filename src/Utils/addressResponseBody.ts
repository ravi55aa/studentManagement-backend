import { IResponse } from "../Interfaces/IResponse";
import { IAddress } from "../Models/addressModel";

export const handleAddressResponseBody
=(message:string,data:Promise<IAddress>): 
IResponse<Promise<IAddress>>=>{
    return {
        success:true,
        message:message,
        data:data,
        error:null
    }
}
