import {  ISchoolService} 
    from "../Interfaces/services/ISchoolService"
import { ISchoolRepository } 
    from "../Interfaces/repository/ISchoolRepository";
import { IUserRepository } 
    from "../Interfaces/repository/IAdminRepository";

import  { ISchool } 
    from "../Models/schoolModel";
import { IAddress } 
    from "../Models/addressModel";
import { FilterQuery } from "mongoose";




export class SchoolService implements ISchoolService {

    private schoolRepository: ISchoolRepository;
    private userRepository: IUserRepository;

    constructor(
        schoolRepository: ISchoolRepository,
        userRepository: IUserRepository
    ) {
        this.schoolRepository = schoolRepository;
        this.userRepository = userRepository;
    }





    public async createSchool(
        adminId: string,
        schoolData: ISchool,
    ) {
        const admin = await this.userRepository.findById(adminId);
        if (!admin) { throw new Error("Admin not found"); }

        const plainSchoolData =
            (schoolData && typeof schoolData.toObject === "function")
                ? schoolData.toObject()
                : schoolData;

        const createdSchool =
            await this.schoolRepository.createSchool({
                ...plainSchoolData,
                userId: admin._id
            });

        admin.tenantId = createdSchool._id;
        await admin.save();

        return createdSchool;
    }




    async getSchool(query: FilterQuery<Partial<ISchool>>) {
        const school = await this.schoolRepository.findOne(query);
        if (!school) throw new Error("School not found");
        return school;
    }





    public async updateSchool(
        schoolId: string,
        updateData: Partial<ISchool>
    ):Promise<ISchool|null> {
        // Ensure the school exists
        const existingSchool = await this.schoolRepository.findById(schoolId);
        if (!existingSchool) {
            throw new Error("School not found");
        }

        // Convert schema object to plain object if needed
        const plainUpdateData =
            (updateData && typeof updateData.toObject === "function")
                ? updateData.toObject()
                : updateData;

        const updatedSchool =
            await this.schoolRepository.updateSchool(
                schoolId,
                { $set: { ...plainUpdateData } }
            );

        return updatedSchool;
    }




    public async deleteSchool(schoolId: string) {
        const school = await this.schoolRepository.findById(schoolId);
        if (!school) {
            throw new Error("School not found");
        }

        // Remove school from DB
        await this.schoolRepository.deleteSchool(schoolId);

        /* Optional:
        Remove tenantId from admin who created this school
        await this.userRepository.updateMany(
            { tenantId: schoolId },
            { $unset: { tenantId: "" } }
        );
        */

        return { message: "School deleted successfully" };
    }




    public async addAddress(address: IAddress): Promise<IAddress> {
        const newAddress = await this.userRepository.addAddress(address);
        return newAddress;
    }
}


































// export class SchoolService 
// implements ISchoolService {

//     private schoolRepository: ISchoolRepository;

//     private userRepository: IUserRepository;



//     constructor(
//         schoolRepository: ISchoolRepository,
//         userRepository: IUserRepository
//     ) {
//         this.schoolRepository = schoolRepository;
//         this.userRepository = userRepository;
//     }



//     public async createSchool(
//         adminId:string,
//         schoolData: ISchool,
//     ) {
        
//         const admin = 
//         await this.userRepository.findById(adminId);

//         if (!admin) { throw new Error("Admin not found");}

//         const plainSchoolData =
//             (schoolData && typeof schoolData.toObject === "function")
//             ? schoolData.toObject()
//             : schoolData;

//         const createdSchool = 
//         await this.schoolRepository
//         .createSchool({...plainSchoolData,userId:admin._id});

        
//         admin.tenantId = createdSchool._id;
//         await admin.save();

//         return createdSchool;
//     }



//     async getSchool(query: FilterQuery<Partial<ISchool>>) {
//         try{
    
//             const isSchool=await this.schoolRepository.findOne(query);

//             return isSchool;
//         } catch(err){
//             throw new Error("No school found");
//         }
//     }




//     public async addAddress(address: IAddress): Promise<IAddress> {
//         const newAddress=await this.userRepository.addAddress(address);
//         return newAddress;
//     }

    
// }