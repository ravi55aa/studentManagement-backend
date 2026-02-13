import { Request, Response, NextFunction } from "express";
import { ITeacherService } from "../Interfaces/services/ITeacherService";

export class TeacherController {
    private readonly teacherService: ITeacherService;

    constructor(teacherService: ITeacherService) {
        this.teacherService = teacherService;
    }

    public async createTeacherBio(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
        const { status, resBody } =
            await this.teacherService.createTeacherBio(req,res);

        res.status(status).json(resBody);
        } catch (error) {
        next(error);
        }
    }

    public async createTeacher(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
        const { status, resBody } =
            await this.teacherService.createTeacher(req,res);

        res.status(status).json(resBody);
        } catch (error) {
        next(error);
        }
    }

    public async updateTeacherBio(
    req: Request,
    res: Response,
    next: NextFunction
    ): Promise<void> {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                success: false,
                message: "Teacher ID is required",
            });
            return;
        }

        const { status, resBody } =
        await this.teacherService.updateTeacherBio(id, req);

        res.status(status).json(resBody);
    } catch (error) {
        next(error);
    }
    }


    public async getAllTeachers(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
        const { status, resBody } =
            await this.teacherService.getAllTeachers();

        res.status(status).json(resBody);
        } catch (error) {
        next(error);
        }
    }

    public async getAllUnAssignedTeachers(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
        const { status, resBody } =
            await this.teacherService.getUnassignedTeachers();

        res.status(status).json(resBody);
        } catch (error) {
        next(error);
        }
    }


    public async getTeacherById(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const { id } = req.params;

        const result = await this.teacherService.getTeacherById(id!);

        return res.status(result.status).json(result.resBody);
    } catch (err) {
        next(err);
    }
    }


    public async assignClassToTeacher(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
        const { status, resBody } =
            await this.teacherService.assignClassToTeacher(req);

        res.status(status).json(resBody);
        } catch (error) {
        next(error);
        }
    }

    // public async updateTeacher(
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ): Promise<void> {
    //     try {
    //     const { status, resBody } =
    //         await this.teacherService.updateTeacher(req);

    //     res.status(status).json(resBody);
    //     } catch (error) {
    //     next(error);
    //     }
    // }

    // public async deleteTeacher(
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ): Promise<void> {
    //     try {
    //     const { status, resBody } =
    //         await this.teacherService.deleteTeacher(req);

    //     res.status(status).json(resBody);
    //     } catch (error) {
    //     next(error);
    //     }
    // }
}
