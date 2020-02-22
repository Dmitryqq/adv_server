import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { User } from "../entity/User";
import config from "../config/config";
import { JsonController, Get, NotFoundError, Req, Res, Post, Body } from "routing-controllers";
import * as jwt from "jsonwebtoken";
import { Role } from "../entity/Role";
import * as bcrypt from "bcryptjs";

@JsonController()
export class AuthController {

    private userRepository = getRepository(User);
    private roleRepository = getRepository(Role);

    @Post("/auth/login")
    async all(@Body({ required: true }) ad: any, @Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            let { username, password } = request.body;
            if (!(username && password)) {
                throw new NotFoundError("No body");
            }
            let user: User;
            try {
                user = await this.userRepository.findOneOrFail({ where: { username }, relations: ["role"] });
            } catch (error) {
                throw new NotFoundError("No such user");
            }

            
            //Check if encrypted password match
            if (!user.checkIfUnencryptedPasswordIsValid(password)) {
                throw new NotFoundError("Wrong password");
            }

            //Sing JWT, valid for 1 hour
            const token = jwt.sign(
                { userId: user.id, username: user.username, role: user.role.name, enabled: user.status },
                config.jwtSecret,
                { expiresIn: "1h" }
            );

            //Send the jwt in the response
            return response.send(token);
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Post("/auth/register")
    async save(@Body({ required: true }) user: any, @Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            let user = new User();
            let { username, password, name, phone, email } = request.body;
            user.username = username;
            user.name = name;
            user.phone = phone;
            user.email = email;
            user.role = await this.roleRepository.findOne(4);
            user.password = password;
            user.hashPassword();
            await this.userRepository.save(user);
            return response.status(200).json({message: "Nice"});
        }
        catch(e){
            if(e.httpCode)
                return response.status(e.httpCode).json({message: e.message})
            return response.json({message: e.message})
        }
    }
}