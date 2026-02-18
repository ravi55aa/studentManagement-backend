import { Request, Response, NextFunction } from "express";
import { IFeeService } from "../Interfaces/services/IFeeService";

export class FeeController {

    private readonly feeService: IFeeService;

    constructor(feeService: IFeeService) {
        this.feeService = feeService;
    }

    /* ----------------------------------------
        CREATE FEE
    ---------------------------------------- */
    public async createFee(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            const { status, resBody } =
                await this.feeService.createFee(req, res);

            res.status(status).json(resBody);

        } catch (error) {
            next(error);
        }
    }


    /* ----------------------------------------
        UPDATE FEE
    ---------------------------------------- */
    public async updateFee(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            const { id } = req.params;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: "Fee ID is required",
                });
                return;
            }

            const { status, resBody } =
                await this.feeService.updateFee(id, req);

            res.status(status).json(resBody);

        } catch (error) {
            next(error);
        }
    }


    /* ----------------------------------------
        GET ALL FEES
    ---------------------------------------- */
    public async getAllFees(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            const { status, resBody } =
                await this.feeService.getAllFees(req);

            res.status(status).json(resBody);

        } catch (error) {
            next(error);
        }
    }


    /* ----------------------------------------
        GET FEE BY ID
    ---------------------------------------- */
    public async getFeeById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            const { id } = req.params;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: "Fee ID is required",
                });
                return;
            }

            const result =
                await this.feeService.getFeeById(id);

            res.status(result.status).json(result.resBody);

        } catch (error) {
            next(error);
        }
    }


    /* ----------------------------------------
        DELETE FEE (Soft Delete Recommended)
    ---------------------------------------- */
    public async deleteFee(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            const { id } = req.params;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: "Fee ID is required",
                });
                return;
            }

            const { status, resBody } =
                await this.feeService.deleteFee(id);

            res.status(status).json(resBody);

        } catch (error) {
            next(error);
        }
    }
}
