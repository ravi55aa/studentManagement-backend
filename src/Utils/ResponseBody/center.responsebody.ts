import { StatusCodes } from "../../Constants/statusCodes";
import { IResponse } from "../../Interfaces/IResponse";
import { ICenter } from "../../Models/centerModel";

export class CenterResponseBody{
    static createCenter(newCenterDoc:Partial<ICenter|null>){
        
        const responseBody:IResponse<Partial<ICenter|null>>={
            success:newCenterDoc?true:false,
            data:newCenterDoc?newCenterDoc:null,
            error:newCenterDoc?null:"something went wrong, cant add center",
            message:newCenterDoc?"New Center Added Successfully":"Cant add Center"
        }

        return {
            status:
            newCenterDoc?
            StatusCodes.OK:
            StatusCodes.INTERNAL_SERVER_ERROR,resBody:responseBody};
    }
}