import { Request, Response, NextFunction } 
    from "express";
import { ITeacherService } from "../Interfaces/services/ITeacherService";




export class TeacherController {
    private teacherService: ITeacherService;

    constructor(ts: ITeacherService) {
        this.teacherService = ts;
    }

    //*create
    public async createTeacherBio(req: Request, res: Response, next: NextFunction) {
        try {
            
            const {status,resBody} = 
            await this.teacherService.createTeacherBio(req,res);

            return res.status(status).json(resBody);

        } catch (err) {
            next(err);
        }
    }

    public async createTeacher(req: Request, res: Response, next: NextFunction) {
        try {
            
            const {status,resBody} = 
            await this.teacherService.createTeacher(req,res);

            return res.status(status).json(resBody);

        } catch (err) {
            next(err);
        }
    }


    public async updateSchool(req:Request,res:Response):Promise<void>{}

    public async deleteSchool(req:Request,res:Response):Promise<void>{}

}
