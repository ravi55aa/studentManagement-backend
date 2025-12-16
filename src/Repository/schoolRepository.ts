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

        return await schoolModel.findByIdAndUpdate(
            schoolId,
            { $set: updateData },
            { new: true } //retunrs updated doc 
        ).exec();
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