import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { JsonController, Get, Post, Delete, NotFoundError, Req, Res, Body, UseBefore } from "routing-controllers";
import { Advertisement } from "../entity/Advertisement";
import { AdvertisementChannel } from "../entity/AdvertisementChannel";
import { Channel } from "../entity/Channel";
import { Tariff } from "../entity/Tariff";
import { Status } from "../entity/Status";
import { ChannelTariff } from "../entity/ChannelTariff";
import { Notification } from "../entity/Notification";
import { checkJwt } from "../middlewares/checkJWT";
import { NotificationType } from "../entity/NotificationType";

@JsonController()
export class AdvertisementChannelController {

    private adsRepository = getRepository(Advertisement);
    private adsChannelRepository = getRepository(AdvertisementChannel);
    private notificationReopository = getRepository(Notification);
    private notificationTypesReopository = getRepository(NotificationType);
    private userRepository = getRepository(User);
    private channelRepository = getRepository(Channel);
    private tariffRepostory = getRepository(Tariff);
    private statusRepostory = getRepository(Status);
    private channelTariffRepostory = getRepository(ChannelTariff);

    @Get("/ads/:id/channel")
    async all(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try {
            const adsChannels = this.adsChannelRepository
                .createQueryBuilder("adsChannels")
                .where("adsChannels.advertisementId = :id", { id: request.params.id })
                .leftJoinAndSelect("adsChannels.channel", "channel")
                .leftJoinAndSelect("adsChannels.tariff", "tariff")
                .leftJoinAndSelect("adsChannels.status", "status")
                .leftJoinAndSelect("adsChannels.agent", "user")
                .leftJoinAndSelect("user.role", "role")
                .getMany()
            return adsChannels;
        }
        catch (e) {
            return response.status(e.httpCode).json({ message: e.message })
        }
    }

    @UseBefore(checkJwt)
    @Get("/ads/:adId/channel/:channelId/accept")
    async accept(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try {
            let adChannel = await this.adsChannelRepository
                .createQueryBuilder("adsChannels")
                .where("adsChannels.advertisementId = :adId", { adId: request.params.adId })
                .leftJoinAndSelect("adsChannels.channel", "channel")
                .leftJoinAndSelect("adsChannels.advertisement", "advertisement")
                .leftJoinAndSelect("advertisement.user", "user")
                .leftJoinAndSelect("adsChannels.tariff", "tariff")
                .leftJoinAndSelect("adsChannels.status", "status")
                .leftJoinAndSelect("adsChannels.agent", "agent")
                .leftJoinAndSelect("user.role", "role")
                .andWhere("channel.id = :channelId", { channelId: request.params.channelId })
                .getOne()
            adChannel.status = await this.statusRepostory.findOne({ where: { id: 3 } })
            adChannel.agent = await this.userRepository.findOne({ where: { id: response.locals.jwtPayload.userId } })
            this.addUserAcceptNotification(adChannel.advertisement.user.id, adChannel.advertisement.adv_text, adChannel.channel.name)
            return this.adsChannelRepository.save(adChannel);
        }
        catch (e) {
            console.log(e)
            return response.status(e.httpCode).json({ message: e.message })
        }
    }

    @UseBefore(checkJwt)
    @Get("/ads/:adId/channel/:channelId/reject")
    async reject(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try {
            let adChannel = await this.adsChannelRepository
                .createQueryBuilder("adsChannels")
                .where("adsChannels.advertisementId = :adId", { adId: request.params.adId })
                .leftJoinAndSelect("adsChannels.channel", "channel")
                .leftJoinAndSelect("adsChannels.advertisement", "advertisement")
                .leftJoinAndSelect("advertisement.user", "user")
                .leftJoinAndSelect("adsChannels.tariff", "tariff")
                .leftJoinAndSelect("adsChannels.status", "status")
                .leftJoinAndSelect("adsChannels.agent", "agent")
                .leftJoinAndSelect("user.role", "role")
                .andWhere("channel.id = :channelId", { channelId: request.params.channelId })
                .getOne()
            adChannel.status = await this.statusRepostory.findOne({ where: { id: 4 } })
            adChannel.agent = await this.userRepository.findOne({ where: { id: response.locals.jwtPayload.userId } })
            this.addUserRejectNotification(adChannel.advertisement.user.id, adChannel.advertisement.adv_text, adChannel.channel.name)
            return this.adsChannelRepository.save(adChannel);
        }
        catch (e) {
            console.log(e)
            return response.status(e.httpCode).json({ message: e.message })
        }
    }

    @UseBefore(checkJwt)
    @Get("/ads/:adId/channel/:channelId/pay")
    async pay(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try {
            let adChannel = await this.adsChannelRepository
                .createQueryBuilder("adsChannels")
                .where("adsChannels.advertisementId = :adId", { adId: request.params.adId })
                .leftJoinAndSelect("adsChannels.channel", "channel")
                .leftJoinAndSelect("adsChannels.advertisement", "advertisement")
                .leftJoinAndSelect("advertisement.user", "user")
                .leftJoinAndSelect("adsChannels.tariff", "tariff")
                .leftJoinAndSelect("adsChannels.status", "status")
                .leftJoinAndSelect("adsChannels.agent", "agent")
                .leftJoinAndSelect("user.role", "role")
                .andWhere("channel.id = :channelId", { channelId: request.params.channelId })
                .getOne()
            let user = new User();
            user = await this.userRepository.findOne({ where: { id: response.locals.jwtPayload.userId }, relations: ["role"] })
            if (user.balance >= adChannel.total_price) {
                user.balance -= adChannel.total_price
                adChannel.status = await this.statusRepostory.findOne({ where: { id: 2 } })
                this.addUserPayedNotification(adChannel.advertisement.user.id, adChannel.advertisement.adv_text, adChannel.channel.name)
            }
            this.userRepository.save(user)
            return await this.adsChannelRepository.save(adChannel);
            // let user = new User();
            // user = await this.userRepository.findOne({ where: { id: response.locals.jwtPayload.userId }, relations: ["role"] })
            // user.balance -= adChannel.total_price;
            // this.userRepository.save(user)
            // return await this.adsChannelRepository.save(adChannel);
        }
        catch (e) {
            console.log(e)
            return response.status(e.httpCode).json({ message: e.message })
        }
    }

    // @Get("/ads/:id")
    // async one(@Req() request: Request, @Res() response: Response, next: NextFunction) {
    //     try{
    //         // let ads = await this.adsRepository.findOne(request.params.id, { relations: ["user"] });
    //         const ads = this.adsRepository
    //             .createQueryBuilder("ad")
    //             .where("ad.id = :id", {id: request.params.id})
    //             .leftJoinAndSelect("ad.user", "user")
    //             .leftJoinAndSelect("user.role", "role")
    //             .getOne()
    //         if (!ads)
    //             throw new NotFoundError('Ad was not found.')
    //         return ads;
    //     }
    //     catch(e){
    //         return response.status(e.httpCode).json({message: e.message})
    //     }
    // }

    @Post("/ads/:id/channel")
    async save(@Body({ required: true }) ad: any, @Req() request: Request, @Res() response: Response, next: NextFunction) {
        try {
            let channelTariff = await this.channelTariffRepostory.findOne({ where: { channel: request.body.channelId, tariff: request.body.tariffId } })
            let ad = await this.adsRepository.findOne({ where: { id: request.params.id } })
            if (!channelTariff)
                throw new NotFoundError('Channel tariff was not found.')
            let adChannel = request.body
            adChannel.channel = await this.channelRepository.findOne(request.body.channelId)
            // adChannel.agent = await this.userRepository.findOne(request.body.userId)
            adChannel.tariff = await this.tariffRepostory.findOne(request.body.tariffId)
            adChannel.status = await this.statusRepostory.findOne(request.body.statusId)
            adChannel.advertisement = await this.adsRepository.findOne(request.params.id)
            if (adChannel.tariff.id == 1)
                adChannel.total_price = channelTariff.price * ad.adv_text.replace(/\s+/g, '').length * request.body.days;
            else
                adChannel.total_price = channelTariff.price * ad.adv_text.split(/\s+/).length * request.body.days;
            return this.adsChannelRepository.save(adChannel);
        }
        catch (e) {
            return response.status(e.httpCode).json({ message: e.message })
        }
    }

    // @Delete("/ads/:id")
    // async remove(@Req() request: Request, @Res() response: Response, next: NextFunction) {
    //     try {
    //         let adToRemove = await this.adsRepository.findOne(request.params.id);
    //         if (!adToRemove)
    //             throw new NotFoundError('Ad was not found.')
    //         await this.adsRepository.remove(adToRemove);
    //         return response.status(200).json({message: "Ad removed"})
    //     } catch (e) {
    //         return response.status(e.httpCode).json({message: e.message})
    //     }
    // }

    addUserAcceptNotification = async (userId, text, channelName) => {
        var notification = new Notification;
        notification.notification_text = `Объявление "${text}" ожидает выхода в эфир на канале ${channelName}`
        notification.user = await this.userRepository.findOne({ where: { id: userId } })
        notification.type = await this.notificationTypesReopository.findOne({ where: { id: 1 } })
        await this.notificationReopository.save(notification);
    }

    addUserRejectNotification = async (userId, text, channelName) => {
        var notification = new Notification;
        notification.notification_text = `Объявление "${text}" на канале ${channelName} отклонено`
        notification.user = await this.userRepository.findOne({ where: { id: userId } })
        notification.type = await this.notificationTypesReopository.findOne({ where: { id: 2 } })
        await this.notificationReopository.save(notification);
    }

    addUserPayedNotification = async (userId, text, channelName) => {
        var notification = new Notification;
        notification.notification_text = `Объявление "${text}" на канале ${channelName} оплачено и ожидает проверки`
        notification.user = await this.userRepository.findOne({ where: { id: userId } })
        notification.type = await this.notificationTypesReopository.findOne({ where: { id: 2 } })
        await this.notificationReopository.save(notification);
    }
}