import { NextFunction, Request, Response } from "express";
import { Body, Get, JsonController, NotFoundError, Post, Req, Res } from "routing-controllers";
import { getRepository } from "typeorm";
import { AdvertisementDate } from "../entity/AdvertisementDate";
import { AdvertisementChannel } from "../entity/AdvertisementChannel";

@JsonController()
export class AdvertisementDateController {

    private adsChannelRepository = getRepository(AdvertisementChannel);
    private adsDateRepository = getRepository(AdvertisementDate);

    @Get("/ads/:id/date")
    async all(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            const adChannel = await this.adsChannelRepository.findOne({where: {advertisement: request.params.id}});
            if(!adChannel)
                throw new NotFoundError('Advertisement-channel was not found.')
            // const ads = await this.adsRepository.find({ relations: ["user"] });
            const adDates = this.adsDateRepository
                .createQueryBuilder("adDates")
                .where("adDates.advertisementChannelId = :id", {id: adChannel.id})
                // .leftJoinAndSelect("adsDates.advertisement", "advertisement")
                .getMany()
            return adDates;
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

    @Post("/ads/:id/date")
    async save(@Body({ required: true }) ad: any, @Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            const adChannel = await this.adsChannelRepository.findOne({where: {id: request.params.id}});
            if(!adChannel)
                throw new NotFoundError('Advertisement-channel was not found.')
            for(let date of request.body.dates){
                let adDate = new AdvertisementDate();
                adDate.date = date.split('T')[0];
                adDate.advertisementchannel = adChannel;
                await this.adsDateRepository.save(adDate)
            };
            // return this.adsDateRepository.save(adDates);
            return response.json({message: "Nice"})
        }
        catch(e){
            console.log(e.message)
            // return response.status(e.httpCode).json({message: e.message})
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
}