import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import { JsonController, Get, Post, Delete, NotFoundError, Req, Res } from "routing-controllers";
import { Channel } from "../entity/Channel";
import { UserChannel } from "../entity/UserChannel";

@JsonController()
export class UserChannelController {

    private userRepository = getRepository(User);
    private channelRepository = getRepository(Channel);
    private userChannelRepository = getRepository(UserChannel);

    @Get("/users/:id/channels")
    async all(@Req() request: Request, @Res() response: Response) {
        try{
            // const userChannels = await this.userChannelRepository.find(request.params.id,);
            const userChannels = this.userChannelRepository
                .createQueryBuilder("userChannel")
                .where("userChannel.userId = :id", {id: request.params.id})
                .leftJoinAndSelect("userChannel.channel", "channel")
                .getMany()
            console.log("userchannels")
            return userChannels;
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

    @Post("/users/:id/channels")
    async save(@Req() request: Request, @Res() response: Response) {
        try{
            let userChannel = request.body
            userChannel.user = await this.userRepository.findOne(request.params.id)
            userChannel.channel = await this.channelRepository.findOne(request.body.channelId)
            return this.userChannelRepository.save(userChannel);
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Delete("/users/:id/channels/:ch_id")
    async remove(@Req() request: Request, @Res() response: Response) {
        try {
            let recordToRemove = await this.userChannelRepository.findOne({where: {user: request.params.id, channel: request.params.ch_id}});
            if (!recordToRemove)
                throw new NotFoundError('Record was not found.')
            await this.userChannelRepository.remove(recordToRemove);
        } catch (e) {
            return response.status(e.httpCode).json({message: e.message})
        }
    }

}