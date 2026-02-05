import { ISchoolRepository } 
    from "../Interfaces/repository/ISchoolRepository";
import schoolModel, { ISchool } 
    from "../Models/schoolModel";
import { BaseRepository } from "./BaseRepository";




export class SchoolRepository 
    extends BaseRepository<ISchool>
    implements ISchoolRepository 
{
    constructor() {
        super(schoolModel);
    }




    public async findByName(email: string): Promise<ISchool | null> {
        return await schoolModel.findOne({ email }).exec();
    }




    public async findById(schoolId: string): Promise<ISchool | null> {
        return await schoolModel.findById(schoolId).exec();
    }




    public async createSchool(schoolData: ISchool): Promise<ISchool> {
        const newSchool = new schoolModel(schoolData);
        await newSchool.save();
        return newSchool;
    }




    public async updateSchool(
        schoolId: string,
        updateData: Partial<ISchool>
    ): Promise<ISchool | null> {
        try{
            if (!schoolId) {
                throw new Error("School ID is required");
            }

            const updatedSchool = await schoolModel
            .findByIdAndUpdate(
                schoolId,
                { $set: updateData },
                { new: true } // return updated document
            )
            .exec();

            if (!updatedSchool) {
            throw new Error("School not found");
            }

            return updatedSchool;
        } catch(error){
            console.error("❌ updateSchool error:", error);

            // rethrow so controller / global error handler can handle it
            throw new Error("Failed to update school");
        }
    }




    public async deleteSchool(
        schoolId: string
    ): Promise<boolean> {

        const result = await schoolModel.findByIdAndDelete(schoolId).exec();
        return result ? true : false;
    }
}











































/**
 * public async updateSchool(
        schoolId: string, 
        updateData: Partial<ISchool>
    ): Promise<ISchool | null> {
        return await schoolModel
            .findByIdAndUpdate(schoolId, updateData, { new: true })
            .exec();
    }

    public async deleteSchool(schoolId: string): Promise<boolean> {
        const result = await schoolModel.findByIdAndDelete(schoolId).exec();
        return result ? true : false;
    }

    public async getAllSchools(): Promise<ISchool[]> {
        return await schoolModel.find().exec();
    }
 */