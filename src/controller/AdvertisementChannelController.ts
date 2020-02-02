import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import { JsonController, Get, Post, Delete, NotFoundError, Req, Res, Body } from "routing-controllers";
import { Advertisement } from "../entity/Advertisement";
import { AdvertisementChannel } from "../entity/AdvertisementChannel";

@JsonController()
export class AdvertisementChannelController {

    private adsRepository = getRepository(Advertisement);
    private adsChannelRepository = getRepository(AdvertisementChannel);
    private userRepository = getRepository(User);

    @Get("/ads/:id/channel")
    async all(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            // const ads = await this.adsRepository.find({ relations: ["user"] });
            const adsChannels = this.adsChannelRepository
                .createQueryBuilder("adsChannels")
                .where("adsChannels.advertisementId = :id", {id: request.params.id})
                .leftJoinAndSelect("adsChannels.channel", "channel")
                .leftJoinAndSelect("adsChannels.tariff", "tariff")
                .leftJoinAndSelect("adsChannels.status", "status")
                .leftJoinAndSelect("adsChannels.agent", "user")
                .leftJoinAndSelect("user.role", "role")
                .getMany()
            return adsChannels;
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
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

    // @Post("/ads")
    // async save(@Body({ required: true }) ad: any, @Req() request: Request, @Res() response: Response, next: NextFunction) {
    //     try{
    //         console.log(request.body)
    //         let ad = request.body
    //         ad.user = await this.userRepository.findOne(request.body.userId)
    //         return this.adsRepository.save(ad);
    //     }
    //     catch(e){
    //         return response.status(e.httpCode).json({message: e.message})
    //     }
    // }

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
}