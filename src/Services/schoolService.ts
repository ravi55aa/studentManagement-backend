import { ISchoolService } from '../Interfaces/services/ISchoolService';

import { IUserRepository } from '../Interfaces/repository/IAdminRepository';

import { ISchool } from '../Models/schoolModel';
import { IAddress } from '../Models/addressModel';

import { handleJwtTokensGenerator, IJwtPayload } from '../Utils/jwt';
import { SchoolAcademicYearDto, SchoolDTO } from '../dto/schoolDTO';
import { Request, Response } from 'express';
import { serviceReturnType } from '../Constants/interfaces';
import { IAddressRepository } from '../Interfaces/repository/IAddressRepository';
import { IDocumentRepository } from '../Interfaces/repository/IDocument.interface';
import { IResponse } from '../Interfaces/IResponse';
import { AddressDTO } from '../dto/addressDTO';
import { SchoolRepository } from '../Repository/schoolRepository';
import { injectable, inject } from 'tsyringe';
import { UserRepository } from '../Repository/userRepository';
import { AddressRepository } from '../Repository/addressRepository';
import { DocumentRepository } from '../Repository/documentRepository';
import bcrypt from 'bcrypt';
import { ApiResponse } from '../Constants/apiResponse';

@injectable()
export class SchoolService implements ISchoolService {
  constructor(
    @inject(SchoolRepository)
    private schoolRepository: SchoolRepository,

    @inject(UserRepository)
    private userRepository: IUserRepository,

    @inject(AddressRepository)
    private addressRepo: IAddressRepository,

    @inject(DocumentRepository)
    private docRepo: IDocumentRepository,
  ) {}

  public async createSchool(req: Request, res: Response) {
    let schoolData: Partial<ISchool> = SchoolDTO.createSchool(req.body);
    const hashedPassword = await bcrypt.hash(schoolData.password!, 10);
    schoolData.password = hashedPassword;

    const adminId: string | undefined = req.user?.userId; //JWT middleware attaches

    const admin = await this.userRepository.findById(adminId!);
    if (!admin) {
      throw new Error('Admin not found');
    }

    const plainSchoolData =
      schoolData && typeof schoolData.toObject === 'function' ? schoolData.toObject() : schoolData;

    const createdSchool = await this.schoolRepository.createSchool({
      ...plainSchoolData,
      userId: admin._id,
    });

    admin.tenantId = createdSchool._id;
    await admin.save();

    const payload: IJwtPayload = {
      userId: admin._id,
      tenantId: createdSchool._id,
      role: 'School',
    };
    handleJwtTokensGenerator(payload, req, res);

    return createdSchool;
  }

  //LOGIN
  async getSchool(req: Request, res: Response) {
    let { password, schoolName, userId } = SchoolDTO.getSchool(req, res);

    const school = await this.schoolRepository.findOne({ schoolName, userId });

    if (school) {
      const hashedPassword = await bcrypt.compare(password, school.password!);
      if (!hashedPassword) {
        ApiResponse.notFound('School NOT found, credentials miss match');
        return school;
      }
    }
    if (!school) throw new Error('School not found');

    //JWT ****
    const payload: IJwtPayload = {
      role: 'School',
      userId: school.userId!,
      tenantId: school._id,
    };

    handleJwtTokensGenerator(payload, req, res);

    return school;
  }

  async updateSchoolMeta(req: Request, res: Response): Promise<serviceReturnType> {
    const { id, dtoData } = SchoolDTO.updateSchool(req, res);

    await this.schoolRepository.updateSchool(id, dtoData);

    const status = 200;
    const resBody = {
      success: true,
      data: null,
      error: null,
      message: 'Updated successfully',
    };

    return { status, resBody };
  }

  // public async updateSchool(
  //     schoolId: string,
  //     updateData: Partial<ISchool>
  // ):Promise<ISchool|null> {
  //     // Ensure the school exists
  //     const existingSchool = await this.schoolRepository.findById(schoolId);
  //     if (!existingSchool) {
  //         throw new Error("School not found");
  //     }

  //     // Convert schema object to plain object if needed
  //     const plainUpdateData =
  //         (updateData && typeof updateData.toObject === "function")
  //             ? updateData.toObject()
  //             : updateData;

  //     const updatedSchool =
  //         await this.schoolRepository.updateSchool(
  //             schoolId,
  //             { $set: { ...plainUpdateData } }
  //         );

  //     return updatedSchool;
  // }

  //TODO handleResponseOf();
  public async getSchoolAllData(req: Request, res: Response): Promise<serviceReturnType> {
    const { tenantId } = SchoolAcademicYearDto.getTenantId(req, res);

    const schoolDoc: Partial<ISchool | null> = await this.schoolRepository.findById(tenantId!);

    const addrQuery = { userId: tenantId };
    const schoolAddressDoc = await this.addressRepo.findOne(addrQuery);

    const docsQuery = { userId: tenantId, role: 'School' };
    const schoolFilesDoc = await this.docRepo.findOne(docsQuery);

    const allData = {
      meta: schoolDoc,
      address: schoolAddressDoc,
      documents: schoolFilesDoc,
    };

    //handleResBody
    const status = schoolAddressDoc ? 200 : 500;
    const resBody: IResponse<object> = {
      error: schoolAddressDoc ? null : 'something went down',
      data: allData,
      success: schoolAddressDoc !== null ? true : false,
      message: schoolAddressDoc ? 'Data fetched Successfully' : 'Something went down',
    };
    //const {status,resBody}=AcademicYearResponseBody.newAcademicYear(allData);

    return { status, resBody };
  }

  public async deleteSchool(schoolId: string) {
    const school = await this.schoolRepository.findById(schoolId);
    if (!school) {
      throw new Error('School not found');
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

    return { message: 'School deleted successfully' };
  }

  public async addAddress(req: Request, res: Response): Promise<IAddress> {
    const dto: Partial<IAddress> = AddressDTO.handleAddress(req, res);

    const newAddress = await this.userRepository.addAddress(dto);

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
