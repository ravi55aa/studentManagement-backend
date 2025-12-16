import {IDocument} from "../../Models/documentModel"
import { ISchool } from "../../Models/schoolModel"
import { IUser } from "../../Models/userModel"


export interface IForgotPasswordRepository{
    findAdmin(email:string):Promise<IUser|null>,

    findSchool(email:string):Promise<ISchool|null>
}