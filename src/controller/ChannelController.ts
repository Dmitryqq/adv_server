import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { JsonController, Get, Post, Delete, NotFoundError, Req, Res, Body } from "routing-controllers";
import {Channel} from "../entity/Channel"

@JsonController()
export class ChannelController {

    private channelRepository = getRepository(Channel);

    @Get("/channels")
    async all(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            return await this.channelRepository.find();;
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Get("/channels/:id")
    async one(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            let channel = await this.channelRepository.findOne(request.params.id);
            if (!channel)
                throw new NotFoundError('Channel was not found.')
            return channel;
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Post("/channels")
    async save(@Body({ required: true }) channel: any, @Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            let channel = request.body
            if(channel.id)
                channel.update_date = new Date().toLocaleString();
            return this.channelRepository.save(channel);
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Delete("/channels/:id")
    async remove(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try {
            let channelToRemove = await this.channelRepository.findOne(request.params.id);
            if (!channelToRemove)
                throw new NotFoundError('Channel was not found.')
            await this.channelRepository.remove(channelToRemove);
        } catch (e) {
            return response.status(e.httpCode).json({message: e.message})
        }
    }

}