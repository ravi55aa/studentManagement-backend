import { Request, Response } from "express";
import { IFeeService } from "../Interfaces/services/IFeeService";
import { FeeRepository } from "../Repository/feeRepository";
import { FeeDto } from "../dto/feesDto";
import { ApiResponse } from "../Constants/apiResponse"; 
import { serviceReturnType } from "../Constants/interfaces"; 
import { IFee } from "../Models/feesModel";
import { injectable,inject } from "tsyringe";



@injectable()
export class FeeService implements IFeeService {

    constructor(
        @inject(FeeRepository)
        private feeRepo:FeeRepository)
    {}

    
    public async createFee(
        req: Request,
        res: Response
    ): Promise<serviceReturnType> {

        const dto: Partial<IFee> =
            FeeDto.createFeeDto(req, res);

        // Check duplicate code
        const existing =
            await this.feeRepo.findOne({ code: dto.code });

        if (existing) {
            return ApiResponse.badRequest(
                "Fee code already exists"
            );
        }

        const newFee =
            await this.feeRepo.create(dto);

        return ApiResponse.created(newFee);
    }


    
    public async updateFee(
        id: string,
        req: Request
    ): Promise<serviceReturnType> {

        const dto: Partial<IFee> =
            FeeDto.updateFeeDto(req);

        const updated =
            await this.feeRepo.updateById(id, dto);

        if (!updated) {
            return ApiResponse.notFound(
                "Fee not found"
            );
        }

        return ApiResponse.success(updated);
    }


    public async getAllFees(
        req: Request
    ): Promise<serviceReturnType> {

        const fees =
            await this.feeRepo.findMany({});

        if (!fees.length) {
            return ApiResponse.notFound(
                "No Fees Found"
            );
        }

        return ApiResponse.success(fees);
    }


    public async getFeeById(
        id: string
    ): Promise<serviceReturnType> {

        const fee =
            await this.feeRepo.findById(id);

        if (!fee) {
            return ApiResponse.notFound(
                "Fee not found"
            );
        }

        return ApiResponse.success(fee);
    }


    public async deleteFee(
        id: string
    ): Promise<serviceReturnType> {

        const deleted =
            await this.feeRepo.deleteById(id);

        if (!deleted) {
            return ApiResponse.notFound(
                "Fee not found"
            );
        }

        return ApiResponse.success(
            "Fee deleted successfully"
        );
    }
}
