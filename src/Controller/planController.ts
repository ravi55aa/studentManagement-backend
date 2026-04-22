import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { TYPES } from '@DI/types';
import { IPlanService } from '@Interfaces/services/IPlanService';
import { ApiResponse } from '@Constants/apiResponse';
import { SubscriptionPlanMessage } from '@Constants/resposeMessages';

@injectable()
export default class PlanController {
  constructor(
    @inject(TYPES.PlanService)
    private _planService: IPlanService,
  ) {}

  // CREATE PLAN
  public async createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body;

      if (!body || Object.keys(body).length === 0) {
        const { status, resBody } = ApiResponse.badRequest(SubscriptionPlanMessage.EmptyBody);
        res.status(status).json(resBody);
        return;
      }

      const { status, resBody } = await this._planService.createPlan(body);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  // GET ALL PLANS (WITH QUERY)
  public async getAllPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query;

      const { status, resBody } = await this._planService.getAllPlans(query);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  // GET PLAN BY ID
  public async getPlanById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { planId } = req.params;

      if (!planId) {
        const { status, resBody } = ApiResponse.notFound(SubscriptionPlanMessage.InvalidPlanId);
        res.status(status).json(resBody);
        return;
      }

      const { status, resBody } = await this._planService.getPlanById(planId);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  // UPDATE PLAN
  public async updatePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { planId } = req.params;
      const body = req.body;

      if (!planId) {
        const { status, resBody } = ApiResponse.notFound(SubscriptionPlanMessage.InvalidPlanId);
        res.status(status).json(resBody);
        return;
      }

      if (!body || Object.keys(body).length === 0) {
        const { status, resBody } = ApiResponse.badRequest(SubscriptionPlanMessage.EmptyBody);
        res.status(status).json(resBody);
        return;
      }

      const { status, resBody } = await this._planService.updatePlan(planId, body);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  // DELETE PLAN
  public async deletePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { planId } = req.params;

      if (!planId) {
        const { status, resBody } = ApiResponse.notFound(SubscriptionPlanMessage.InvalidPlanId);
        res.status(status).json(resBody);
        return;
      }

      const { status, resBody } = await this._planService.deletePlan(planId);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  // TOGGLE ACTIVE
  public async toggleActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { planId } = req.params;
      const { isActive } = req.body;

      if (!planId) {
        const { status, resBody } = ApiResponse.notFound(SubscriptionPlanMessage.InvalidPlanId);
        res.status(status).json(resBody);
        return;
      }

      if (typeof isActive !== 'boolean') {
        const { status, resBody } = ApiResponse.badRequest(
          SubscriptionPlanMessage.InvalidActiveStatus,
        );
        res.status(status).json(resBody);
        return;
      }

      const { status, resBody } = await this._planService.toggleActive(planId, isActive);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }

  // TOGGLE POPULAR
  public async togglePopular(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { planId } = req.params;
      const { isPopular } = req.body;

      if (!planId) {
        const { status, resBody } = ApiResponse.notFound(SubscriptionPlanMessage.InvalidPlanId);
        res.status(status).json(resBody);
        return;
      }

      if (typeof isPopular !== 'boolean') {
        const { status, resBody } = ApiResponse.badRequest(
          SubscriptionPlanMessage.InvalidPopularStatus,
        );
        res.status(status).json(resBody);
        return;
      }

      const { status, resBody } = await this._planService.togglePopular(planId, isPopular);

      res.status(status).json(resBody);
    } catch (error) {
      next(error);
    }
  }
}
