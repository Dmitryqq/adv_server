import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import { JsonController, Get, Post, Delete, NotFoundError, Req, Res, Body, UseBefore, Authorized } from "routing-controllers";
import { Advertisement } from "../entity/Advertisement";
import { checkJwt } from "../middlewares/checkJWT";
import { AdvertisementChannel } from "../entity/AdvertisementChannel";
import { AdvertisementDate } from "../entity/AdvertisementDate";
import { ChannelAgents } from "../entity/ChannelAgents";

@JsonController()
export class AdvertisementController {

    private adsRepository = getRepository(Advertisement);
    private userRepository = getRepository(User);
    private channelAgentsRepository = getRepository(ChannelAgents);

    @Get("/ads")
    async all(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            // const ads = await this.adsRepository.find({ relations: ["user"] });
            const ads = this.adsRepository
                .createQueryBuilder("ad")
                .leftJoinAndSelect("ad.user", "user")
                .leftJoinAndSelect("user.role", "role")
                .getMany()
            return ads;
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Get("/myads")
    @UseBefore(checkJwt)
    async usersAds(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            const ads = await this.adsRepository
                .createQueryBuilder("ad")
                .leftJoin("ad.user", "user")
                .where("user.id = :id", {id: response.locals.jwtPayload.userId})
                .leftJoinAndMapMany("ad.adv_channels", AdvertisementChannel, "adv_channels", "adv_channels.advertisementId = ad.id")
                .leftJoinAndSelect("adv_channels.channel", "channel")
                .leftJoinAndSelect("adv_channels.tariff", "tariff")
                .leftJoinAndSelect("adv_channels.status", "status")
                .leftJoinAndSelect("adv_channels.agent", "agent")
                .leftJoinAndMapMany("adv_channels.dates", AdvertisementDate, "adv_dates", "adv_dates.advertisementchannelId = adv_channels.id")
                .getMany()
            return ads;
        }
        catch(e){
            console.log(e.message)
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Get("/adsonmychannel")
    @UseBefore(checkJwt)
    async agentsAds(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            const channelAgents = this.channelAgentsRepository
                .createQueryBuilder("channelAgents")
                .leftJoinAndSelect("channelAgents.channel", "channel")
                .where("channelAgents.userId = :id", {id: response.locals.jwtPayload.userId})
                .leftJoinAndMapMany("channel.adv_channels", AdvertisementChannel, "adv_channels", "channelAgents.channelId = adv_channels.channelId")
                .leftJoinAndSelect("adv_channels.advertisement", "advertisement")
                // .leftJoinAndSelect("adv_channels.channel", "adchannel")
                .leftJoinAndSelect("adv_channels.status", "status")
                .leftJoinAndSelect("adv_channels.tariff", "tariff")
                .leftJoinAndSelect("adv_channels.agent", "agent")
                .leftJoinAndMapMany("adv_channels.dates", AdvertisementDate, "adv_dates", "adv_dates.advertisementchannelId = adv_channels.id")
                .getMany()
            return channelAgents;
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Get("/ads/:id")
    async one(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            // let ads = await this.adsRepository.findOne(request.params.id, { relations: ["user"] });
            const ads = this.adsRepository
                .createQueryBuilder("ad")
                .where("ad.id = :id", {id: request.params.id})
                .leftJoinAndSelect("ad.user", "user")
                .leftJoinAndSelect("user.role", "role")
                .getOne()
            if (!ads)
                throw new NotFoundError('Ad was not found.')
            return ads;
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Post("/ads")
    @UseBefore(checkJwt)
    @Authorized(["Главный администратор", "Рекламодатель"])
    async save(@Body({ required: true }) ad: any, @Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            let ad = request.body
            ad.user = await this.userRepository.findOneOrFail({ where: { id: response.locals.jwtPayload.userId } })
            return this.adsRepository.save(ad);
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Delete("/ads/:id")
    async remove(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try {
            let adToRemove = await this.adsRepository.findOne(request.params.id);
            if (!adToRemove)
                throw new NotFoundError('Ad was not found.')
            await this.adsRepository.remove(adToRemove);
            return response.status(200).json({message: "Ad removed"})
        } catch (e) {
            return response.status(e.httpCode).json({message: e.message})
        }
    }

}