import { injectable, inject } from 'tsyringe';
import { ApiResponse } from '@Constants/apiResponse';
import { SubscriptionPlanMessage } from '@Constants/resposeMessages';
import { serviceReturnType } from '@Constants/interfaces';
import { IPlanService } from '@Interfaces/services/IPlanService';
import { IPlan } from '@Models/subsciptionPlanModel';
import { TYPES } from '@DI/types';
import { IPlanRepository } from '@Interfaces/repository/IPlanRepository';
import { FilterQuery } from 'mongoose';
import { BadRequestError, FailureError, NotFoundError } from '@Middlewares/narrowDownErrors';
import logger from '@Utils/logger';

@injectable()
export class PlanService implements IPlanService {
  constructor(
    @inject(TYPES.PlanRepository)
    private _planRepo: IPlanRepository,
  ) {}

  // CREATE PLAN
  async createPlan(data: Partial<IPlan>): Promise<serviceReturnType> {
    const existing = await this._planRepo.findByName(data.name!);

    if (existing) {
      logger.warn('[PlanService:createPlan] Plan already exists', {
        planName: data.name,
      });

      throw new BadRequestError(SubscriptionPlanMessage.PlanExists);
    }

    // calculate finalAmount
    if (data.amount && data.discount !== undefined) {
      const discountAmount = (data.amount * data.discount) / 100;

      data.finalAmount = data.amount - discountAmount;
    }

    const doc = await this._planRepo.create(data);

    if (!doc) {
      logger.error('[PlanService:createPlan] Failed to create subscription plan', {
        payload: data,
      });

      throw new FailureError(SubscriptionPlanMessage.PlanCreateFailed);
    }

    return ApiResponse.success(doc, SubscriptionPlanMessage.PlanCreated);
  }

  // GET ALL PLANS
  async getAllPlans(query: FilterQuery<Partial<IPlan>>): Promise<serviceReturnType> {
    const docs = await this._planRepo.findAll(query);

    if (!docs || docs.length === 0) {
      logger.warn('[PlanService:getAllPlans] No plans found', {
        query,
      });

      throw new NotFoundError(SubscriptionPlanMessage.NoPlansFound);
    }

    return ApiResponse.success(docs, SubscriptionPlanMessage.PlansListed);
  }

  // GET PLAN BY ID
  async getPlanById(id: string): Promise<serviceReturnType> {
    const doc = await this._planRepo.findById(id);

    if (!doc) {
      logger.warn('[PlanService:getPlanById] Plan not found', {
        planId: id,
      });

      throw new NotFoundError(SubscriptionPlanMessage.PlanNotFound);
    }

    return ApiResponse.success(doc, SubscriptionPlanMessage.PlanFetched);
  }

  // UPDATE PLAN
  async updatePlan(planId: string, data: Partial<IPlan>): Promise<serviceReturnType> {
    const existing = await this._planRepo.findById(planId);

    if (!existing) {
      logger.warn('[PlanService:updatePlan] Plan not found during update', {
        planId,
      });

      throw new NotFoundError(SubscriptionPlanMessage.PlanNotFound);
    }

    // recalculate final amount
    if (data.amount && data.discount !== undefined) {
      const discountAmount = (data.amount * data.discount) / 100;

      data.finalAmount = data.amount - discountAmount;
    }

    const updated = await this._planRepo.update(planId, data);

    if (!updated) {
      logger.error('[PlanService:updatePlan] Failed to update plan', {
        planId,
        payload: data,
      });

      throw new FailureError(SubscriptionPlanMessage.PlanUpdateFailed);
    }

    return ApiResponse.success(updated, SubscriptionPlanMessage.PlanUpdated);
  }

  // DELETE PLAN
  async deletePlan(id: string): Promise<serviceReturnType> {
    const existing = await this._planRepo.findById(id);

    if (!existing) {
      logger.warn('[PlanService:deletePlan] Plan not found during delete', {
        planId: id,
      });

      throw new NotFoundError(SubscriptionPlanMessage.PlanNotFound);
    }

    const deleted = await this._planRepo.delete(id);

    if (!deleted) {
      logger.error('[PlanService:deletePlan] Failed to delete plan', {
        planId: id,
      });

      throw new FailureError(SubscriptionPlanMessage.PlanDeleteFailed);
    }

    return ApiResponse.success({ deleted: true }, SubscriptionPlanMessage.PlanDeleted);
  }

  // TOGGLE ACTIVE
  async toggleActive(id: string, isActive: boolean): Promise<serviceReturnType> {
    const existing = await this._planRepo.findById(id);

    if (!existing) {
      logger.warn('[PlanService:toggleActive] Plan not found', {
        planId: id,
        isActive,
      });

      throw new NotFoundError(SubscriptionPlanMessage.PlanNotFound);
    }

    const updated = await this._planRepo.update(id, {
      isActive,
    });

    if (!updated) {
      logger.error('[PlanService:toggleActive] Failed to toggle active status', {
        planId: id,
        isActive,
      });

      throw new FailureError(SubscriptionPlanMessage.PlanUpdateFailed);
    }

    return ApiResponse.success(
      updated,
      isActive ? SubscriptionPlanMessage.PlanActivated : SubscriptionPlanMessage.PlanDeactivated,
    );
  }

  // TOGGLE POPULAR
  async togglePopular(id: string, isPopular: boolean): Promise<serviceReturnType> {
    const existing = await this._planRepo.findById(id);

    if (!existing) {
      logger.warn('[PlanService:togglePopular] Plan not found', {
        planId: id,
        isPopular,
      });

      throw new NotFoundError(SubscriptionPlanMessage.PlanNotFound);
    }

    const updated = await this._planRepo.update(id, {
      isPopular,
    });

    if (!updated) {
      logger.error('[PlanService:togglePopular] Failed to toggle popular status', {
        planId: id,
        isPopular,
      });

      throw new FailureError(SubscriptionPlanMessage.PlanUpdateFailed);
    }

    return ApiResponse.success(
      updated,
      isPopular
        ? SubscriptionPlanMessage.PlanMarkedPopular
        : SubscriptionPlanMessage.PlanUnmarkedPopular,
    );
  }
}
