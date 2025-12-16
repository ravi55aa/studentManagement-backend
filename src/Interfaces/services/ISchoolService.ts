import { ISchool } from "../../Models/schoolModel";
import { IAddress } from "../../Models/addressModel";
import { FilterQuery } from "mongoose";





export interface ISchoolService {

    createSchool(
        adminId: string | undefined,
        metaData: Partial<ISchool>
    ): Promise<ISchool>;

    addAddress(address: Partial<IAddress>): Promise<IAddress>;

    getSchool(
        query: FilterQuery<Partial<ISchool>>
    ): Promise<ISchool | null>;

    // 👉 NEW: UPDATE SCHOOL
    updateSchool(
        schoolId: string,
        updateData: Partial<ISchool>
    ): Promise<ISchool|null>;

    // 👉 NEW: DELETE SCHOOL
    deleteSchool(
        schoolId: string
    ): Promise<{ message: string }>;
}

