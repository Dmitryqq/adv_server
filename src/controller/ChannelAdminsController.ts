import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import { JsonController, Get, Post, Delete, NotFoundError, Req, Res, Body, UseBefore } from "routing-controllers";
import { Channel } from "../entity/Channel";
import { ChannelAdmins } from "../entity/ChannelAdmins";
import { checkJwt } from "../middlewares/checkJWT";

@JsonController()
export class ChannelAdminsController {

    private userRepository = getRepository(User);
    private channelRepository = getRepository(Channel);
    private channelAdminsRepository = getRepository(ChannelAdmins);

    //Мои каналы
    @Get("/admin/mychannels")
    @UseBefore(checkJwt)
    async usersChannel(@Req() request: Request, @Res() response: Response) {
        try{
            // console.log(response.locals.jwtPayload.userId)
            // const channelAdmins = this.channelAdminsRepository.find({ 
            //     where: { userId: response.locals.jwtPayload.userId }, relations: ["channel"]})
            const channelAdmins = this.channelAdminsRepository
                .createQueryBuilder("channelAdmin")
                .where("channelAdmin.userId = :id", {id: response.locals.jwtPayload.userId})
                .leftJoinAndSelect("channelAdmin.channel", "channel")
                .getMany()
            return channelAdmins;
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Get("/all/channels/admins")
    async all(@Req() request: Request, @Res() response: Response) {
        try{
            const channelAdmins = this.channelAdminsRepository
                .createQueryBuilder("channelAdmin")
                .leftJoinAndSelect("channelAdmin.channel", "channel")
                .leftJoinAndSelect("channelAdmin.user", "user")
                .orderBy("channelAdmin.id")
                .getMany()
            return channelAdmins;
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }
    // @Get("/users/:id")
    // async one(@Req() request: Request, @Res() response: Response, next: NextFunction) {
    //     try{
    //         let user = await this.userRepository.findOne(request.params.id, { relations: ["role"] });
    //         if (!user)
    //             throw new NotFoundError('User was not found.')
    //         return user;
    //     }
    //     catch(e){
    //         return response.status(e.httpCode).json({message: e.message})
    //     }
    // }

    @Post("/channel/admin")
    async save(@Body({ required: true }) channelAdmin: any,@Req() request: Request, @Res() response: Response) {
        try{
            let channelAdmin = request.body
            channelAdmin.user = await this.userRepository.findOne(request.body.userId)
            channelAdmin.channel = await this.channelRepository.findOne(request.body.channelId)
            return this.channelAdminsRepository.save(channelAdmin);
        }
        catch(e){
            return response.json({message: e.message})
            // return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Delete("/users/:id/channels/:ch_id")
    async remove(@Req() request: Request, @Res() response: Response) {
        try {
            let recordToRemove = await this.channelAdminsRepository.findOne({where: {user: request.params.id, channel: request.params.ch_id}});
            if (!recordToRemove)
                throw new NotFoundError('Record was not found.')
            await this.channelAdminsRepository.remove(recordToRemove);
        } catch (e) {
            return response.status(e.httpCode).json({message: e.message})
        }
    }

}