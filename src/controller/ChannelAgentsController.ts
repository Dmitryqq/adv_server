import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import { JsonController, Get, Post, Delete, NotFoundError, Req, Res, Body } from "routing-controllers";
import { Channel } from "../entity/Channel";
import { ChannelAgents } from "../entity/ChannelAgents";

@JsonController()
export class ChannelAgentsController {

    private userRepository = getRepository(User);
    private channelRepository = getRepository(Channel);
    private channelAgentsRepository = getRepository(ChannelAgents);

    //Мои каналы
    @Get("/users/:id/channels")
    async usersChannel(@Req() request: Request, @Res() response: Response) {
        try{
            const channelAgents = this.channelAgentsRepository
                .createQueryBuilder("ChannelAgents")
                .where("ChannelAgents.userId = :id", {id: request.params.id})
                .leftJoinAndSelect("ChannelAgents.channel", "channel")
                .getMany()
            return ChannelAgents;
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Get("/all/channels/agents")
    async all(@Req() request: Request, @Res() response: Response) {
        try{
            const channelAgents = this.channelAgentsRepository
                .createQueryBuilder("channelAgent")
                .leftJoinAndSelect("channelAgent.channel", "channel")
                .leftJoinAndSelect("channelAgent.user", "user")
                .orderBy("channelAgent.id")
                .getMany()
            return channelAgents;
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

    @Post("/channel/agent")
    async save(@Body({ required: true }) channelAgent: any,@Req() request: Request, @Res() response: Response) {
        try{
            let channelAgent = request.body
            channelAgent.user = await this.userRepository.findOne(request.body.userId)
            channelAgent.channel = await this.channelRepository.findOne(request.body.channelId)
            return this.channelAgentsRepository.save(channelAgent);
        }
        catch(e){
            return response.json({message: e.message})
            // return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Delete("/users/:id/channels/:ch_id")
    async remove(@Req() request: Request, @Res() response: Response) {
        try {
            let recordToRemove = await this.channelAgentsRepository.findOne({where: {user: request.params.id, channel: request.params.ch_id}});
            if (!recordToRemove)
                throw new NotFoundError('Record was not found.')
            await this.channelAgentsRepository.remove(recordToRemove);
        } catch (e) {
            return response.status(e.httpCode).json({message: e.message})
        }
    }

}