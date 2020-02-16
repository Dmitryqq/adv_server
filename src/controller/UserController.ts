import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import { Role } from "../entity/Role";
import { JsonController, Get, Post, Delete, NotFoundError, Req, Res, Body, UseBefore, Authorized } from "routing-controllers";
import { checkJwt } from "../middlewares/checkJWT";

@JsonController()
export class UserController {

    private userRepository = getRepository(User);
    private roleRepository = getRepository(Role);

    @Get("/users")
    @UseBefore(checkJwt)
    @Authorized(["Главный администратор"])
    async all(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            const users = await this.userRepository.find({ relations: ["role"] });
            // response.status(200).send(users);
            return response.status(200).send(users);
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
            let user = new User();
            let { id, roleId, username, password, name, phone, email } = request.body;
            user.id = id;
            user.username = username;
            user.name = name;
            user.phone = phone;
            user.email = email;
            user.role = await this.roleRepository.findOne(roleId);
            user.password = password;
            user.hashPassword();
            console.log(user)
            await this.userRepository.save(user);
            return response.status(200).json({message: "Nice"});
            // let user = new User();
            // user = request.body
            // if(user.role) 
            //     user.role = await this.roleRepository.findOne(request.body.roleId)
            // if(user.id)
            //     user.update_date = new Date();
            // if(user.password){
            //     user.password = request.body.password;
            //     console.log(user.password);
            //     user.hashPassword();
            //     console.log(user.password);
            //     // user.password = password;
            // }
            // return await this.userRepository.save(user);
            // // return response.status(200).json({message: "Nice"});
        }
        catch(e){
            if(e.httpCode)
                return response.status(e.httpCode).json({message: e.message})
            return response.json({message: e.message})
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