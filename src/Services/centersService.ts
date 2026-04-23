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
    try{
      const dto: Partial<ICenter> = CenterDto.handleNewCenterDto(req, res);
  
      // Check if already exists
      const existing = await this._centerRepo.findByName(dto.name!);
      if (existing) {
        throw new FailureError(CenterMessage.CenterExists);
      }
  
      const newCenterDoc = await this._centerRepo.addCenter(dto);
  
      return ApiResponse.success(newCenterDoc, CenterMessage.CenterAdded);
    } catch (error) {
      logger.error('Error creating center:', error);
      throw new InternalServerError();
    }
  }

  async createCenterAddress(req: Request, res: Response): Promise<serviceReturnType> {
    try{
      const { id } = req.params;
  
      const dto: Partial<IAddress> = AddressDTO.handleAddress(req, res);
      dto.userId = id;
      dto.userType = 'Center';
  
      const doc = await this._addressRepo.create(dto);
  
      return ApiResponse.success(doc, CenterMessage.CenterUpdated);

    }catch(error){
      logger.error('Error creating center address:', error);
      throw new InternalServerError();
    }
  }

  async getCenterById(req: Request): Promise<serviceReturnType> {
    try{
      const { id } = req.params;
  
      const doc = await this._centerRepo.findById(id!);
  
      if (!doc) {
        throw new FailureError(CenterMessage.CenterNotFound);
      }
  
      return ApiResponse.success(doc, CenterMessage.CenterListed);

    }catch(error){
      logger.error('Error fetching center:', error);
      throw new InternalServerError();
    }
  }

  async getAllCenters(): Promise<serviceReturnType> {
    try{
      const docs = await this._centerRepo.getAllCenters();
  
      if (!docs || docs.length === 0) {
        throw new FailureError(CenterMessage.CenterNotFound);
      }
  
      return ApiResponse.success(docs, CenterMessage.CenterListed);
      
    } catch(error){
      logger.error('Error fetching centers:', error);
      throw new InternalServerError();
    }
  }

  async updateCenter(req: Request, res: Response): Promise<serviceReturnType> {
    try {
      const { id } = req.params;
      const updatedData: Partial<ICenter> = CenterDto.handleNewCenterDto(req, res);

      const updatedDoc = await this._centerRepo.updateCenter(id!, updatedData);

      if (!updatedDoc) {
        throw new FailureError(CenterMessage.CenterNotFound);
      }

      return ApiResponse.success(updatedDoc, CenterMessage.CenterUpdated);
    } catch(error){
      logger.error('Error updating center:', error);
      throw new InternalServerError();
    }
  }

  async deleteCenter(req: Request): Promise<serviceReturnType> {
    try{
        const { id } = req.params;
    
        const deleted = await this._centerRepo.deleteCenter(id!);
    
        if (!deleted) {
          return ApiResponse.failure(CenterMessage.CenterNotFound);
        }
    
        return ApiResponse.success(null, CenterMessage.CenterDeleted);

    } catch(error){
      logger.error('Error deleting center:', error);
      throw new InternalServerError();
    }
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
