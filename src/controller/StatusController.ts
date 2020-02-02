import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Status} from "../entity/Status";
import { JsonController, Get, NotFoundError, Req, Res } from "routing-controllers";

@JsonController()
export class StatusController {

    private statusRepository = getRepository(Status);

    @Get("/statuses")
    async all(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try {
            return this.statusRepository.find();
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        } 
    }

    @Get("/statuses/:id")
    async one(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            let status = await this.statusRepository.findOne(request.params.id);
            if (!status)
                throw new NotFoundError('Status was not found.')
            return status;
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    // async save(request: Request, response: Response, next: NextFunction) {
    //     return this.statusRepository.save(request.body);
    // }

    // async remove(request: Request, response: Response, next: NextFunction) {
    //     let userToRemove = await this.statusRepository.findOne(request.params.id);
    //     await this.statusRepository.remove(userToRemove);
    // }
}