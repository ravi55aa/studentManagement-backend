import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { FailureError, InternalServerError } from '@Middlewares/narrowDownErrors';
import logger from '@Utils/logger';
import { TYPES } from '@DI/types';
import { CenterDto } from '@dto/centersDto';
import { ICenter } from '@Models/centerModel';
import { IAddress } from '@Models/addressModel';
import { serviceReturnType } from '@Constants/interfaces';
import { ICenterService } from '@Interfaces/services/ICenterService';
import { ApiResponse } from '@Constants/apiResponse';
import { CenterMessage } from '@Constants/resposeMessages';
import { IAddressRepository } from '@Interfaces/repository/IAddressRepository';
import { ICenterRepository } from '@Interfaces/repository/ICenterRepository';

import { AddressDTO } from '../dto/addressDTO';

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

    const existing = await this._centerRepo.findByName(dto.name!);

    if (existing) {
      logger.warn('[CentersService:createCenter] Center already exists', {
        centerName: dto.name,
      });

      throw new FailureError(CenterMessage.CenterExists);
    }

    const newCenterDoc = await this._centerRepo.addCenter(dto);

    if (!newCenterDoc) {
      logger.error('[CentersService:createCenter] Failed to create center', {
        payload: dto,
      });

      throw new InternalServerError();
    }

    return ApiResponse.success(newCenterDoc, CenterMessage.CenterAdded);
  }

  async createCenterAddress(req: Request, res: Response): Promise<serviceReturnType> {
    const { id } = req.params;

    const dto: Partial<IAddress> = AddressDTO.handleAddress(req, res);

    dto.userId = id;
    dto.userType = 'Center';

    const doc = await this._addressRepo.create(dto);

    if (!doc) {
      logger.error('[CentersService:createCenterAddress] Failed to create center address', {
        centerId: id,
        payload: dto,
      });

      throw new InternalServerError();
    }

    return ApiResponse.success(doc, CenterMessage.CenterUpdated);
  }

  async getCenterById(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;

    const doc = await this._centerRepo.findById(id!);

    if (!doc) {
      logger.warn('[CentersService:getCenterById] Center not found', {
        centerId: id,
      });

      throw new FailureError(CenterMessage.CenterNotFound);
    }

    return ApiResponse.success(doc, CenterMessage.CenterListed);
  }

  async getAllCenters(): Promise<serviceReturnType> {
    const docs = await this._centerRepo.getAllCenters();

    if (!docs || docs.length === 0) {
      logger.warn('[CentersService:getAllCenters] No centers found');

      throw new FailureError(CenterMessage.CenterNotFound);
    }

    return ApiResponse.success(docs, CenterMessage.CenterListed);
  }

  async updateCenter(req: Request, res: Response): Promise<serviceReturnType> {
    const { id } = req.params;

    const updatedData: Partial<ICenter> = CenterDto.handleNewCenterDto(req, res);

    const updatedDoc = await this._centerRepo.updateCenter(id!, updatedData);

    if (!updatedDoc) {
      logger.warn('[CentersService:updateCenter] Center not found during update', {
        centerId: id,
        payload: updatedData,
      });

      throw new FailureError(CenterMessage.CenterNotFound);
    }

    return ApiResponse.success(updatedDoc, CenterMessage.CenterUpdated);
  }

  async deleteCenter(req: Request): Promise<serviceReturnType> {
    const { id } = req.params;

    const deleted = await this._centerRepo.deleteCenter(id!);

    if (!deleted) {
      logger.warn('[CentersService:deleteCenter] Center not found during delete', {
        centerId: id,
      });

      throw new FailureError(CenterMessage.CenterNotFound);
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
