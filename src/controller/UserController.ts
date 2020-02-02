import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import { Role } from "../entity/Role";
import { JsonController, Get, Post, Delete, NotFoundError, Req, Res, Body } from "routing-controllers";

@JsonController()
export class UserController {

    private userRepository = getRepository(User);
    private roleRepository = getRepository(Role);

    @Get("/users")
    async all(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            const users = await this.userRepository.find({ relations: ["role"] });
            return users;
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Get("/users/:id")
    async one(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            let user = await this.userRepository.findOne(request.params.id, { relations: ["role"] });
            if (!user)
                throw new NotFoundError('User was not found.')
            return user;
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Post("/users")
    async save(@Body({ required: true }) user: any, @Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            let user = request.body
            user.role = await this.roleRepository.findOne(request.body.roleId)
            if(user.id)
                user.update_date = new Date().toLocaleString();
            return this.userRepository.save(user);
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Delete("/users/:id")
    async remove(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try {
            let userToRemove = await this.userRepository.findOne(request.params.id);
            if (!userToRemove)
                throw new NotFoundError('User was not found.')
            await this.userRepository.remove(userToRemove);
        } catch (e) {
            return response.status(e.httpCode).json({message: e.message})
        }
    }

}