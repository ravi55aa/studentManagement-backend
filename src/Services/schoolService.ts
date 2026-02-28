import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import bcrypt from 'bcrypt';

import { ISchoolService } from '../Interfaces/services/ISchoolService';
import { IUserRepository } from '../Interfaces/repository/IAdminRepository';
import { ISchool } from '../Models/schoolModel';
import { IAddress } from '../Models/addressModel';
import { handleJwtTokensGenerator, IJwtPayload } from '../Utils/jwt';
import { SchoolAcademicYearDto, SchoolDTO } from '../dto/schoolDTO';
import { serviceReturnType } from '../Constants/interfaces';
import { IAddressRepository } from '../Interfaces/repository/IAddressRepository';
import { IDocumentRepository } from '../Interfaces/repository/IDocument.interface';
import { AddressDTO } from '../dto/addressDTO';
import { SchoolRepository } from '../Repository/schoolRepository';
import { UserRepository } from '../Repository/userRepository';
import { AddressRepository } from '../Repository/addressRepository';
import { DocumentRepository } from '../Repository/documentRepository';
import { ApiResponse } from '../Constants/apiResponse';
import { ISchoolRepository } from '../Interfaces/repository/ISchoolRepository';
import { AdminMessage, AuthMessage, SchoolMessage } from '../Constants/resposeMessages';

@injectable()
export class SchoolService implements ISchoolService {
  constructor(
    @inject(SchoolRepository)
    private _schoolRepository: ISchoolRepository,

    @inject(UserRepository)
    private _userRepository: IUserRepository,

    @inject(AddressRepository)
    private _addressRepo: IAddressRepository,

    @inject(DocumentRepository)
    private _docRepo: IDocumentRepository,
  ) {}

  public async createSchool(req: Request, res: Response):Promise<serviceReturnType> {
    const schoolData: Partial<ISchool> = SchoolDTO.createSchool(req.body);
    const hashedPassword = await bcrypt.hash(schoolData.password!, 10);
    schoolData.password = hashedPassword;

    // const adminId: string | undefined = req.user?.userId; //JWT middleware attaches
    // console.log('@school service, adminId',adminId);

    const admin = await this._userRepository.findOne({name:schoolData.adminName});
    
    if (!admin) {
      return ApiResponse.notFound(AdminMessage.NotFound);
    }

    const plainSchoolData =
      schoolData && typeof schoolData.toObject === 'function' ? schoolData.toObject() : schoolData;


    const createdSchool = await this._schoolRepository.createSchool({
      ...plainSchoolData,
      userId: admin._id,
    });

    if(!createdSchool){
      return ApiResponse.failure('School cannot create');
    }

    admin.tenantId = createdSchool._id;
    await admin.save();

    const payload: IJwtPayload = {
      userId: admin._id,
      tenantId: createdSchool._id,
      role: 'School',
    };

    // if (!req.user) {
    //   return ApiResponse.unAuthorized('User is Unauthorized, or Session data is undefined');
    // }

    // //update Session Data
    // req.user.role!=payload.role;
    // req.user.tenantId!=payload.tenantId;
    // req.user.userId!=payload.userId;

    handleJwtTokensGenerator(payload, req, res);

    return ApiResponse.success(createdSchool,'School Created successfully');
  }

  //LOGIN
  async getSchool(req: Request, res: Response):Promise<serviceReturnType> {
    const { password, schoolName, userId } = SchoolDTO.getSchool(req, res);

    const school = await this._schoolRepository.findOne({ schoolName, userId });

    if (school) {
      const hashedPassword = await bcrypt.compare(password, school.password!);
      if (!hashedPassword) {
        return ApiResponse.failure(AuthMessage.InvalidCurrentPassword);
      }
    }
    if (!school){
      return ApiResponse.failure(SchoolMessage.NotFound);
    }

    //JWT ****
    const payload: IJwtPayload = {
      role: 'School',
      userId: school.userId!,
      tenantId: school._id,
    };

    handleJwtTokensGenerator(payload, req, res);

    return ApiResponse.success(school,SchoolMessage.SchoolListed);
  }

  async updateSchoolMeta(req: Request, res: Response): Promise<serviceReturnType> {
    const { id, dtoData } = SchoolDTO.updateSchool(req, res);

    const updatedSchool=await this._schoolRepository.updateSchool(id, dtoData);

    if(!updatedSchool){
      return ApiResponse.failure(SchoolMessage.NotUpdated);
    }

    return ApiResponse.success(updatedSchool,SchoolMessage.Updated);
  }


  public async getSchoolAllData(req: Request, res: Response): Promise<serviceReturnType> {
    const { tenantId } = SchoolAcademicYearDto.getTenantId(req, res);

    const schoolDoc: Partial<ISchool | null> = await this._schoolRepository.findById(tenantId!);

    const addrQuery = { userId: tenantId };
    const schoolAddressDoc = await this._addressRepo.findOne(addrQuery);

    const docsQuery = { userId: tenantId, role: 'School' };
    const schoolFilesDoc = await this._docRepo.findOne(docsQuery);

    const allData = {
      meta: schoolDoc,
      address: schoolAddressDoc,
      documents: schoolFilesDoc,
    };

    return ApiResponse.success(allData,SchoolMessage.FetchAll);
  }

  public async deleteSchool(schoolId: string) {
    const school = await this._schoolRepository.findById(schoolId);
    if (!school) {
      throw new Error('School not found');
    }

    // Remove school from DB
    await this._schoolRepository.deleteSchool(schoolId);

    /* I CAN:
        Remove tenantId from admin who created this school
        await this._userRepository.updateMany(
            { tenantId: schoolId },
            { $unset: { tenantId: "" } }
        );
        */

    return { message: 'School deleted successfully' };
  }

  public async addAddress(req: Request, res: Response): Promise<IAddress | null> {
    const dto: Partial<IAddress> = AddressDTO.handleAddress(req, res);

    const newAddress = await this._userRepository.addAddress(dto);

    return newAddress;
  }
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
