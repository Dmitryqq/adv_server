import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Role} from "../entity/Role";
import { JsonController, NotFoundError, Req, Res, Get } from "routing-controllers";

@JsonController()
export class RoleController {

    private roleRepository = getRepository(Role);

    @Get("/roles")
    async all(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            return this.roleRepository.find();
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Get("/roles/:id")
    async one(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            let role = await this.roleRepository.findOne(request.params.id);
            if (!role)
                throw new NotFoundError('Role was not found.')
            return role;
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    // async save(request: Request, response: Response, next: NextFunction) {
    //     return this.roleRepository.save(request.body);
    // }

    // async remove(request: Request, response: Response, next: NextFunction) {
    //     let userToRemove = await this.roleRepository.findOne(request.params.id);
    //     await this.roleRepository.remove(userToRemove);
    // }
}