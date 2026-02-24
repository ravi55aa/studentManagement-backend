import { Request, Response } from 'express';
import { CenterDto } from '../dto/centersDto';
import { ICenter } from '../Models/centerModel';
import { AddressDTO } from '../dto/addressDTO';
import { IAddress } from '../Models/addressModel';
import { serviceReturnType } from '../Constants/interfaces';

import { ICenterService } from '../Interfaces/services/ICenterService';
import { inject, injectable } from 'tsyringe';
import { AddressRepository } from '../Repository/addressRepository';
import { CenterRepository } from '../Repository/centerRepository';
import { ApiResponse } from '../Constants/apiResponse';
import { CenterMessage } from '../Constants/resposeMessages';

@injectable()
export class CentersService implements ICenterService {
  constructor(
    @inject(AddressRepository)
    private addressRepo: AddressRepository,

    @inject(CenterRepository)
    private centerRepo: CenterRepository,
  ) {}

  async createCenter(req: Request, res: Response): Promise<serviceReturnType> {
    const dto: Partial<ICenter> = CenterDto.handleNewCenterDto(req, res);

    // Check if already exists
    const existing = await this.centerRepo.findByName(dto.name!);
    if (existing) {
      return ApiResponse.failure(CenterMessage.CenterExists);
    }

    const newCenterDoc = await this.centerRepo.addCenter(dto);

    return ApiResponse.success(newCenterDoc, CenterMessage.CenterAdded);
  }

  async createCenterAddress(req: Request, res: Response): Promise<serviceReturnType> {
    const { id } = req.params;

    const dto: Partial<IAddress> = AddressDTO.handleAddress(req, res);
    dto.userId = id;
    dto.userType = 'Center';

    const doc = await this.addressRepo.create(dto);

    return ApiResponse.success(doc, CenterMessage.CenterUpdated);
  }

  async getCenterById(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;

    const doc = await this.centerRepo.findById(id!);

    if (!doc) {
      return ApiResponse.failure(CenterMessage.CenterNotFound);
    }

    return ApiResponse.success(doc, CenterMessage.CenterListed);
  }

  async getAllCenters(): Promise<serviceReturnType> {
    const docs = await this.centerRepo.getAllCenters();

    if (!docs || docs.length === 0) {
      return ApiResponse.failure(CenterMessage.CenterNotFound);
    }

    return ApiResponse.success(docs, CenterMessage.CenterListed);
  }

  async updateCenter(req: Request, res: Response): Promise<serviceReturnType> {
    const { id } = req.params;
    const updatedData: Partial<ICenter> = CenterDto.handleNewCenterDto(req, res);

    const updatedDoc = await this.centerRepo.updateCenter(id!, updatedData);

    if (!updatedDoc) {
      return ApiResponse.failure(CenterMessage.CenterNotFound);
    }

    return ApiResponse.success(updatedDoc, CenterMessage.CenterUpdated);
  }

  async deleteCenter(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;

    const deleted = await this.centerRepo.deleteCenter(id!);

    if (!deleted) {
      return ApiResponse.failure(CenterMessage.CenterNotFound);
    }

    return ApiResponse.success(null, CenterMessage.CenterDeleted);
  }
}

// //**📌 Relationship / Business Logic

// assignAdminToCenter() {}

// removeAdminFromCenter() {}

// assignSchoolToCenter() {}

// removeSchoolFromCenter() {}

// //** 📌 Status & Lifecycle

// activateCenter() {}

// deactivateCenter() {}
