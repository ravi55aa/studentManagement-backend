import { IPlan } from '@Models/subsciptionPlanModel';
import { serviceReturnType } from '@Constants/interfaces';

export interface IPlanService {
  createPlan(data: IPlan): Promise<serviceReturnType>;

  getAllPlans(query: Partial<IPlan>): Promise<serviceReturnType>;

  getPlanById(id: string): Promise<serviceReturnType>;

  updatePlan(id: string, data: Partial<IPlan>): Promise<serviceReturnType>;

  deletePlan(id: string): Promise<serviceReturnType>;

  toggleActive(id: string, isActive: boolean): Promise<serviceReturnType>;

  togglePopular(id: string, isPopular: boolean): Promise<serviceReturnType>;
}
