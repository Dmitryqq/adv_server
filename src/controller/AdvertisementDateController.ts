import { NextFunction, Request, Response } from "express";
import { Body, Get, JsonController, NotFoundError, Post, Req, Res } from "routing-controllers";
import { getRepository } from "typeorm";
import { Advertisement } from "../entity/Advertisement";
import { AdvertisementDate } from "../entity/AdvertisementDate";

@JsonController()
export class AdvertisementDateController {

    private adsRepository = getRepository(Advertisement);
    private adsDateRepository = getRepository(AdvertisementDate);

    @Get("/ads/:id/date")
    async all(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            const advertisement = await this.adsRepository.findOne(request.params.id);
            if(!advertisement)
                throw new NotFoundError('Advertisement tariff was not found.')
            // const ads = await this.adsRepository.find({ relations: ["user"] });
            const adDates = this.adsDateRepository
                .createQueryBuilder("adDates")
                .where("adDates.advertisementId = :id", {id: request.params.id})
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
            const advertisement = await this.adsRepository.findOne(request.params.id);
            if(!advertisement)
                throw new NotFoundError('Advertisement tariff was not found.')
            let adDates = request.body;
            console.log(adDates)
            adDates.forEach(async element => {
                element.advertisement = advertisement;
                await this.adsDateRepository.save(element);
            });
            // return this.adsDateRepository.save(adDates);
            return response.json({message: "Nice"})
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
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