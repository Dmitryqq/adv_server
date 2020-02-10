import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import { JsonController, Get, Post, Delete, NotFoundError, Req, Res, Body } from "routing-controllers";
import { Channel } from "../entity/Channel";
import { ChannelTariff } from "../entity/ChannelTariff";
import { Tariff } from "../entity/Tariff";

@JsonController()
export class ChannelTariffController {

    private channelTariffRepository = getRepository(ChannelTariff);
    private tariffRepository = getRepository(Tariff);
    private channelRepository = getRepository(Channel);

    @Get("/channels/:id/tariffs")
    async forOneChannel(@Req() request: Request, @Res() response: Response) {
        try{
            const channelTariff = this.channelTariffRepository
                .createQueryBuilder("channelTariff")
                .where("channelTariff.channelId = :id", {id: request.params.id})
                .leftJoinAndSelect("channelTariff.tariff", "tariff")
                .getMany()
            return channelTariff;
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Get("/all/channels/tariffs")
    async all(@Req() request: Request, @Res() response: Response) {
        try{
            const channelTariff = this.channelTariffRepository
                .createQueryBuilder("channelTariff")
                .leftJoinAndSelect("channelTariff.channel", "channel")
                .leftJoinAndSelect("channelTariff.tariff", "tariff")
                .getMany()
            return channelTariff;
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

    @Post("/channels/:id/tariffs")
    async save(@Body({ required: true }) channelTariff: any, @Req() request: Request, @Res() response: Response) {
        try{
            let channelTariff = request.body
            channelTariff.channel = await this.channelRepository.findOne(request.body.channelId)
            channelTariff.tariff = await this.tariffRepository.findOne(request.params.id)
            return this.channelTariffRepository.save(channelTariff);
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Delete("/channels/:id/tariffs/:t_id")
    async remove(@Req() request: Request, @Res() response: Response) {
        try {
            let recordToRemove = await this.channelTariffRepository.findOne({where: {channel: request.params.id, tariff: request.params.t_id}});
            if (!recordToRemove)
                throw new NotFoundError('Record was not found.')
            await this.channelTariffRepository.remove(recordToRemove);
            return response.status(200).json({message: "Record was deleted."})
        } catch (e) {
            return response.status(e.httpCode).json({message: e.message})
        }
    }

}