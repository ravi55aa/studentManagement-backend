import { IAddress } from "../../Models/addressModel"
import { ISchool } from "../../Models/schoolModel"
import { BaseRepository } from "../../Repository/BaseRepository"




export interface ISchoolRepository 
    extends BaseRepository<ISchool>
{
    findByName(name: string): Promise<ISchool | null>;

    findById(id: string): Promise<ISchool | null>;

    
    createSchool(
        schoolMetaData: Partial<ISchool>
    ): Promise<ISchool>;

    // UPDATE
    updateSchool(
        schoolId: string,
        updateData: Partial<ISchool>
    ): Promise<ISchool | null>;

    // DELETE
    deleteSchool(
        schoolId: string
    ): Promise<boolean>;
}
