import { injectable, inject } from 'tsyringe';
import { ApiResponse } from '@Constants/apiResponse';
import { SubscriptionPlanMessage } from '@Constants/resposeMessages';
import { serviceReturnType } from '@Constants/interfaces';
import { IPlanService } from '@Interfaces/services/IPlanService';
import { IPlan } from '@Models/subsciptionPlanModel';
import { TYPES } from '@DI/types';
import { IPlanRepository } from '@Interfaces/repository/IPlanRepository';
import { FilterQuery } from 'mongoose';
import { FailureError, InternalServerError } from '@Middlewares/narrowDownErrors';
import logger from '@Utils/logger';

@injectable()
export class PlanService implements IPlanService {
  constructor(
    @inject(TYPES.PlanRepository)
    private _planRepo: IPlanRepository,
  ) {}

  // CREATE PLAN
  async createPlan(data: Partial<IPlan>): Promise<serviceReturnType> {
    try{
      const existing = await this._planRepo.findByName(data.name!);
  
      if (existing) {
        throw new FailureError(SubscriptionPlanMessage.PlanExists);
      }
  
      //  calculate finalAmount (safety)
      if (data.amount && data.discount) {
        const discountAmount = (data.amount * data.discount) / 100;
        data.finalAmount = data.amount - discountAmount;
      }
  
      const doc = await this._planRepo.create(data);
  
      if (!doc) {
        throw new FailureError(SubscriptionPlanMessage.PlanCreateFailed);
      }
      // check existing (by name)
  
      return ApiResponse.success(doc, SubscriptionPlanMessage.PlanCreated);
    } catch(error){ 
      logger.error('Error creating plan:', error);
      throw new InternalServerError();
    }
  }

  // GET ALL PLANS
  async getAllPlans(query: FilterQuery<Partial<IPlan>>): Promise<serviceReturnType> {
    try{
      const docs = await this._planRepo.findAll(query);
  
      if (!docs || docs.length === 0) {
        throw new FailureError(SubscriptionPlanMessage.NoPlansFound);
      }
  
      return ApiResponse.success(docs, SubscriptionPlanMessage.PlansListed);
    } catch(error){
      logger.error('Error fetching plans:', error);
      throw new InternalServerError();
    }
  }

  // GET PLAN BY ID
  async getPlanById(id: string): Promise<serviceReturnType> {
    try{
      const doc = await this._planRepo.findById(id);
  
      if (!doc) {
        throw new FailureError(SubscriptionPlanMessage.PlanNotFound);
      }
  
      return ApiResponse.success(doc, SubscriptionPlanMessage.PlanFetched);

    } catch(error){
      logger.error('Error fetching plan:', error);
      throw new InternalServerError();
    }
  }

  // UPDATE PLAN
  async updatePlan(planId: string, data: Partial<IPlan>): Promise<serviceReturnType> {
    try{
      const existing = await this._planRepo.findById(planId);
  
      if (!existing) {
        throw new FailureError(SubscriptionPlanMessage.PlanNotFound);
      }
  
      // recalculate if needed
      if (data.amount && data.discount !== undefined) {
        const discountAmount = (data.amount * data.discount) / 100;
        data.finalAmount = data.amount - discountAmount;
      }
  
      const updated = await this._planRepo.update(planId, data);
  
      if (!updated) {
        throw new FailureError(SubscriptionPlanMessage.PlanUpdateFailed);
      }
  
      return ApiResponse.success(updated, SubscriptionPlanMessage.PlanUpdated);

    } catch(error){
      logger.error('Error updating plan:', error);
      throw new InternalServerError();
    }
  }

  // DELETE PLAN
  async deletePlan(id: string): Promise<serviceReturnType> {
    try{
      const existing = await this._planRepo.findById(id);
  
      if (!existing) {
        throw new FailureError(SubscriptionPlanMessage.PlanNotFound);
      }
  
      const deleted = await this._planRepo.delete(id);
  
      if (!deleted) {
        throw new FailureError(SubscriptionPlanMessage.PlanDeleteFailed);
      }
  
      return ApiResponse.success({ deleted: true }, SubscriptionPlanMessage.PlanDeleted);

    } catch(error){
      logger.error('Error deleting plan:', error);
      throw new InternalServerError();
    }
  }

  // TOGGLE ACTIVE
  async toggleActive(id: string, isActive: boolean): Promise<serviceReturnType> {
      try{
        const existing = await this._planRepo.findById(id);

      if (!existing) {
        throw new FailureError(SubscriptionPlanMessage.PlanNotFound);
      }

      const updated = await this._planRepo.update(id, { isActive });

      if (!updated) {
        throw new FailureError(SubscriptionPlanMessage.PlanUpdateFailed);
      }

      return ApiResponse.success(
        updated,
        isActive ? SubscriptionPlanMessage.PlanActivated : SubscriptionPlanMessage.PlanDeactivated,
      );
    }
      catch(error){
        logger.error('Error toggling plan active status:', error);
        throw new InternalServerError();
      }
  }

  // TOGGLE POPULAR
  async togglePopular(id: string, isPopular: boolean): Promise<serviceReturnType> {
    try{
      const existing = await this._planRepo.findById(id);

      if (!existing) {
        throw new FailureError(SubscriptionPlanMessage.PlanNotFound);
      }

      const updated = await this._planRepo.update(id, { isPopular });

      if (!updated) {
        throw new FailureError(SubscriptionPlanMessage.PlanUpdateFailed);
      }

      return ApiResponse.success(
        updated,
        isPopular
          ? SubscriptionPlanMessage.PlanMarkedPopular
          : SubscriptionPlanMessage.PlanUnmarkedPopular,
      );
    } catch(error){
        logger.error('Error toggling plan popular status:', error);
        throw new InternalServerError();
    }
  }
}
