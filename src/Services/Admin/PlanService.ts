import { injectable, inject } from 'tsyringe';
import { ApiResponse } from '@Constants/apiResponse'; 
import { SubscriptionPlanMessage } from '@Constants/resposeMessages'
import { serviceReturnType } from '@Constants/interfaces'; 
import { IPlanService } from '@Interfaces/services/IPlanService'; 
import { IPlan } from '@Models/subsciptionPlanModel';
import { TYPES } from '@DI/types';
import { IPlanRepository } from '@Interfaces/repository/IPlanRepository';
import { FilterQuery } from 'mongoose';

@injectable()
export class PlanService implements IPlanService {
    constructor(
        @inject(TYPES.PlanRepository)
        private _planRepo: IPlanRepository,
    ) {}

    // CREATE PLAN
    async createPlan(data: Partial<IPlan>): Promise<serviceReturnType> {
        // check existing (by name)
        const existing = await this._planRepo.findByName(data.name!);

        if (existing) {
        return ApiResponse.failure(SubscriptionPlanMessage.PlanExists);
        }

        //  calculate finalAmount (safety)
        if (data.amount && data.discount) {
            const discountAmount = (data.amount * data.discount) / 100;
            data.discountAmount = discountAmount;
            data.finalAmount = data.amount - discountAmount;
        }

        const doc = await this._planRepo.create(data);

        if (!doc) {
        return ApiResponse.failure(SubscriptionPlanMessage.PlanCreateFailed);
        }

        return ApiResponse.success(doc, SubscriptionPlanMessage.PlanCreated);
    }

    // GET ALL PLANS
    async getAllPlans(query: FilterQuery<Partial<IPlan>>): Promise<serviceReturnType> {
        const docs = await this._planRepo.findAll(query);

        if (!docs || docs.length === 0) {
        return ApiResponse.failure(SubscriptionPlanMessage.NoPlansFound);
        }

        return ApiResponse.success(docs, SubscriptionPlanMessage.PlansListed);
    }

    // GET PLAN BY ID
    async getPlanById(id: string): Promise<serviceReturnType> {
        const doc = await this._planRepo.findById(id);

        if (!doc) {
        return ApiResponse.failure(SubscriptionPlanMessage.PlanNotFound);
        }

        return ApiResponse.success(doc, SubscriptionPlanMessage.PlanFetched);
    }

    // UPDATE PLAN
    async updatePlan(id: string, data: Partial<IPlan>): Promise<serviceReturnType> {
        const existing = await this._planRepo.findById(id);

        if (!existing) {
        return ApiResponse.failure(SubscriptionPlanMessage.PlanNotFound);
        }

        // recalculate if needed
        if (data.amount && data.discount !== undefined) {
        const discountAmount = (data.amount * data.discount) / 100;
        data.discountAmount = discountAmount;
        data.finalAmount = data.amount - discountAmount;
        }

        const updated = await this._planRepo.update(id, data);

        if (!updated) {
        return ApiResponse.failure(SubscriptionPlanMessage.PlanUpdateFailed);
        }

        return ApiResponse.success(updated, SubscriptionPlanMessage.PlanUpdated);
    }

    // DELETE PLAN
    async deletePlan(id: string): Promise<serviceReturnType> {
        const existing = await this._planRepo.findById(id);

        if (!existing) {
        return ApiResponse.failure(SubscriptionPlanMessage.PlanNotFound);
        }

        const deleted = await this._planRepo.delete(id);

        if (!deleted) {
        return ApiResponse.failure(SubscriptionPlanMessage.PlanDeleteFailed);
        }

        return ApiResponse.success(null, SubscriptionPlanMessage.PlanDeleted);
    }

    // TOGGLE ACTIVE
    async toggleActive(id: string, isActive: boolean): Promise<serviceReturnType> {
        const existing = await this._planRepo.findById(id);

        if (!existing) {
        return ApiResponse.failure(SubscriptionPlanMessage.PlanNotFound);
        }

        const updated = await this._planRepo.update(id, { isActive });

        if (!updated) {
        return ApiResponse.failure(SubscriptionPlanMessage.PlanUpdateFailed);
        }

        return ApiResponse.success(
        updated,
        isActive ? SubscriptionPlanMessage.PlanActivated : SubscriptionPlanMessage.PlanDeactivated
        );
    }

    // TOGGLE POPULAR
    async togglePopular(id: string, isPopular: boolean): Promise<serviceReturnType> {
        const existing = await this._planRepo.findById(id);

        if (!existing) {
        return ApiResponse.failure(SubscriptionPlanMessage.PlanNotFound);
        }

        const updated = await this._planRepo.update(id, { isPopular });

        if (!updated) {
        return ApiResponse.failure(SubscriptionPlanMessage.PlanUpdateFailed);
        }

        return ApiResponse.success(
        updated,
        isPopular
            ? SubscriptionPlanMessage.PlanMarkedPopular
            : SubscriptionPlanMessage.PlanUnmarkedPopular
        );
    }
    }