import { Request, Response } from "express";

import { serviceReturnType } from "../../Constants/interfaces"; 

export interface IHomeworkService {
    createHomework(req: Request, res: Response): Promise<serviceReturnType>;

    updateHomework(req: Request, res: Response): Promise<serviceReturnType>;

    deleteHomework(req: Request): Promise<serviceReturnType>;

    getOneHomework(id: string): Promise<serviceReturnType>;

    viewHomework(req: Request): Promise<serviceReturnType>;

    listAllHomework(): Promise<serviceReturnType>;
}