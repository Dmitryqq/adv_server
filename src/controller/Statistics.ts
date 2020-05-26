import { NextFunction, Request, Response } from "express";
import { Body, Get, JsonController, NotFoundError, Post, Req, Res, UseBefore } from "routing-controllers";
import { getRepository } from "typeorm";
import { AdvertisementDate } from "../entity/AdvertisementDate";
import { AdvertisementChannel } from "../entity/AdvertisementChannel";
// import { Notification } from "../entity/Notification";
import { User } from "../entity/User";
import { checkJwt } from "../middlewares/checkJWT";
import { NotificationType } from "../entity/NotificationType";
import { Notification } from "../entity/Notification";
import { Advertisement } from "../entity/Advertisement";

@JsonController()
export class Statistics {

    private adsChannelRepository = getRepository(AdvertisementChannel);
    private adsDateRepository = getRepository(AdvertisementDate);
    private userRepository = getRepository(User);
    private notificationReopository = getRepository(Notification);
    private notificationTypesReopository = getRepository(NotificationType);

    //Месяц-год
    @Post("/formonth")
    async min(@Body({ required: true }) any: any,@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try {
            let year = request.body.year
            let month = request.body.month
            let channel = request.body.channel
            let adDates = await this.adsDateRepository
                .createQueryBuilder("adDates")
                // .select("adDates.advertisementchannelId")
                .select("min.*")
                .from(subQuery => {
                    return subQuery
                    .select("MIN(date) as min_date")
                    .addSelect("advertisementchannelId")
                    .from(AdvertisementDate, "AdvertisementDate")
                    .groupBy('advertisementchannelId')
                }, "min")
                // .addSelect("MIN(date) as min_date")
                .leftJoinAndMapMany("min.advertisementchannel", AdvertisementChannel, "advertisementchannel", "advertisementchannel.id = min.advertisementchannelId")
                .leftJoinAndMapMany("advertisementchannel.advertisement", Advertisement, "advertisement", "advertisement.id = advertisementchannel.advertisementId")
                .groupBy('advertisementchannelId')
                .where('channelId = :channel', {channel: channel})
                .andWhere('YEAR(min.min_date) = :year',{year: year})
                .andWhere('MONTH(min.min_date) = :month', {month: month})
                .getRawMany()

            adDates = JSON.parse(JSON.stringify(adDates).split('advertisementchannel_').join(''));
            var dates = []
            var end = new Date(year, month)
            var loop = new Date(year, month - 1);
            while (loop < end) {
                var count = 0;
                var price = 0;
                adDates.forEach(element => {
                    if(new Date(element.min_date).getDate() == loop.getDate()){
                        count += 1;
                        price += element.total_price;
                    }
                });
                dates.push({date: loop.toLocaleDateString(), count: count, total: price})
                var newDate = loop.setDate(loop.getDate() + 1);
                loop = new Date(newDate);
            }
            
            return {dates, adDates}
        }
        catch (e) {
            return response.status(e.httpCode).json({ message: e.message })
        }
    }

    //between
    @Post("/betweendates")
    async between(@Body({ required: true }) any: any, @Req() request: Request, @Res() response: Response, next: NextFunction) {
        try {
            let start = new Date(request.body.start)
            let end = new Date(request.body.end)
            let channel = request.body.channel
            let adDates = await this.adsDateRepository
                .createQueryBuilder("adDates")
                // .select("adDates.advertisementchannelId")
                .select("min.*")
                .from(subQuery => {
                    return subQuery
                    .select("MIN(date) as min_date")
                    .addSelect("advertisementchannelId")
                    .from(AdvertisementDate, "AdvertisementDate")
                    .groupBy('advertisementchannelId')
                }, "min")
                // .addSelect("MIN(date) as min_date")
                .leftJoinAndMapMany("min.advertisementchannel", AdvertisementChannel, "advertisementchannel", "advertisementchannel.id = min.advertisementchannelId")
                .leftJoinAndMapMany("advertisementchannel.advertisement", Advertisement, "advertisement", "advertisement.id = advertisementchannel.advertisementId")
                .groupBy('advertisementchannelId')
                .where('channelId = :channel', {channel: channel})
                .andWhere('min.min_date >= :start',  {start: start})
                .andWhere('min.min_date <= :end', {end: end})
                .getRawMany()

            adDates = JSON.parse(JSON.stringify(adDates).split('advertisementchannel_').join(''));
            
            var dates = []
            var loop = new Date(start);

            while (loop < end) {
                var count = 0;
                var price = 0;
                adDates.forEach(element => {
                    if(new Date(element.min_date).getDate() == loop.getDate()){
                        count += 1;
                        price += element.total_price;
                    }
                });
                dates.push({date: loop.toLocaleDateString(), count: count, total: price})
                var newDate = loop.setDate(loop.getDate() + 1);
                loop = new Date(newDate);
            }
            return {dates, adDates}
        }
        catch (e) {
            return response.status(e.httpCode).json({ message: e.message })
        }
    }
}
