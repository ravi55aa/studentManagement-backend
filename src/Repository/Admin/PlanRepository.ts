import { FilterQuery } from 'mongoose';
import { injectable } from 'tsyringe';
import { IPlanRepository } from '@Interfaces/repository/IPlanRepository';
import { BaseRepository } from '@Repository/BaseRepository'; 
import { planModel,IPlan } from '@Models/subsciptionPlanModel'; 
import logger from '@Utils/logger';


@injectable()
export class PlanRepository
    extends BaseRepository<IPlan>
    implements IPlanRepository
    {
    constructor() {
        super(planModel);
    }

    // CREATE PLAN
    async create(data: Partial<IPlan>): Promise<IPlan | null> {
        try {
        return await super.create(data);
        } catch (error) {
        logger.error('CreatePlan failed', {
            layer: 'repository',
            module: 'plan',
            error,
        });
        return null;
        }
    }

    // FIND BY NAME
    async findByName(name: string): Promise<IPlan | null> {
        try {
        return await this.model
            .findOne({ name })
            .lean<IPlan>();
        } catch (error) {
        logger.error('FindByName failed', {
            layer: 'repository',
            module: 'plan',
            error,
        });
        return null;
        }
    }

    // GET ALL (WITH QUERY)
    async findAll(query: FilterQuery<Partial<IPlan>> = {}): Promise<IPlan[]> {
        try {
        const filter: FilterQuery<IPlan> = {};

        //  Dynamic filters
        if (query.isActive !== undefined) {
            filter.isActive = query.isActive === 'true' || query.isActive === true;
        }

        if (query.isPopular !== undefined) {
            filter.isPopular = query.isPopular === 'true' || query.isPopular === true;
        }

        if (query.duration) {
            filter.duration = Number(query.duration);
        }

        return await this.model
            .find(filter)
            .sort({ createdAt: -1 })
            .lean<IPlan[]>();
        } catch (error) {
        logger.error('FindAllPlans failed', {
            layer: 'repository',
            module: 'plan',
            error,
        });
        return [];
        }
    }

    // FIND BY ID
    async findById(id: string): Promise<IPlan | null> {
        try {
        return await this.model
            .findById(id)
            .lean<IPlan>();
        } catch (error) {
        logger.error('FindPlanById failed', {
            layer: 'repository',
            module: 'plan',
            error,
        });
        return null;
        }
    }

    // UPDATE PLAN
    async update(
        id: string,
        data: Partial<IPlan>
    ): Promise<IPlan | null> {
        try {
        return await this.model
            .findByIdAndUpdate(
            id,
            { $set: data },
            {
                new: true,
                runValidators: true,
            }
            )
            .lean<IPlan>();
        } catch (error) {
        logger.error('UpdatePlan failed', {
            layer: 'repository',
            module: 'plan',
            error,
        });
        return null;
        }
    }

    // DELETE PLAN
    async delete(id: string): Promise<IPlan | null> {
        try {
        return await this.model
            .findByIdAndDelete(id)
            .lean<IPlan>();
        } catch (error) {
        logger.error('DeletePlan failed', {
            layer: 'repository',
            module: 'plan',
            error,
        });
        return null;
        }
    }
}