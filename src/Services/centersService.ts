import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { TYPES } from '../DI/types';
import { CenterDto } from '../dto/centersDto';
import { ICenter } from '../Models/centerModel';
import { AddressDTO } from '../dto/addressDTO';
import { IAddress } from '../Models/addressModel';
import { serviceReturnType } from '../Constants/interfaces';
import { ICenterService } from '../Interfaces/services/ICenterService';
import { ApiResponse } from '../Constants/apiResponse';
import { CenterMessage } from '../Constants/resposeMessages';
import { IAddressRepository } from '../Interfaces/repository/IAddressRepository';
import { ICenterRepository } from '../Interfaces/repository/ICenterRepository';

@injectable()
export class CentersService implements ICenterService {
  constructor(
    @inject(TYPES.AddressRepository)
    private _addressRepo: IAddressRepository,

    @inject(TYPES.CenterRepository)
    private _centerRepo: ICenterRepository,
  ) {}

  async createCenter(req: Request, res: Response): Promise<serviceReturnType> {
    const dto: Partial<ICenter> = CenterDto.handleNewCenterDto(req, res);

    // Check if already exists
    const existing = await this._centerRepo.findByName(dto.name!);
    if (existing) {
      return ApiResponse.failure(CenterMessage.CenterExists);
    }

    const newCenterDoc = await this._centerRepo.addCenter(dto);

    return ApiResponse.success(newCenterDoc, CenterMessage.CenterAdded);
  }

  async createCenterAddress(req: Request, res: Response): Promise<serviceReturnType> {
    const { id } = req.params;

    const dto: Partial<IAddress> = AddressDTO.handleAddress(req, res);
    dto.userId = id;
    dto.userType = 'Center';

    const doc = await this._addressRepo.create(dto);

    return ApiResponse.success(doc, CenterMessage.CenterUpdated);
  }

  async getCenterById(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;

    const doc = await this._centerRepo.findById(id!);

    if (!doc) {
      return ApiResponse.failure(CenterMessage.CenterNotFound);
    }

    return ApiResponse.success(doc, CenterMessage.CenterListed);
  }

  async getAllCenters(): Promise<serviceReturnType> {
    const docs = await this._centerRepo.getAllCenters();

    if (!docs || docs.length === 0) {
      return ApiResponse.failure(CenterMessage.CenterNotFound);
    }

    return ApiResponse.success(docs, CenterMessage.CenterListed);
  }

  async updateCenter(req: Request, res: Response): Promise<serviceReturnType> {
    const { id } = req.params;
    const updatedData: Partial<ICenter> = CenterDto.handleNewCenterDto(req, res);

    const updatedDoc = await this._centerRepo.updateCenter(id!, updatedData);

    if (!updatedDoc) {
      return ApiResponse.failure(CenterMessage.CenterNotFound);
    }

    return ApiResponse.success(updatedDoc, CenterMessage.CenterUpdated);
  }

  async deleteCenter(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;

    const deleted = await this._centerRepo.deleteCenter(id!);

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
