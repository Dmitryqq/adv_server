import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { JsonController, Get, Post, Delete, NotFoundError, Req, Res, Body, UseBefore, UseAfter } from "routing-controllers";
import {Channel} from "../entity/Channel";
import { checkJwt } from "../middlewares/checkJWT";
import { User } from "../entity/User";
import { Notification } from "../entity/Notification";

@JsonController()
export class NotificationController {

    private notificationRepository = getRepository(Notification);

    @UseBefore(checkJwt)
    @Get("/notifications")
    async one(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            // let notifications = await this.notificationRepository.find({ where: { userId: response.locals.jwtPayload.userId}, relations: ["user"] , order: {id: "DESC"}});
            let notifications = await this.notificationRepository.createQueryBuilder("notifications")
                    .leftJoinAndSelect("notifications.user", "user")
                    .where("user.id = :id", {id: response.locals.jwtPayload.userId})
                    .orderBy("notifications.id", "DESC")
                    .getMany();
            return notifications;
        }
        catch(e){
            console.log(e)
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @UseBefore(checkJwt)
    @Delete("/notifications/:id")
    async remove(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try {
            let notification = await this.notificationRepository.findOne({ where: { id: request.params.id}});
            if (!notification)
                throw new NotFoundError('Notification was not found.')
            // if(response.locals.jwtPayload.userId != notification.user.id)
            return this.notificationRepository.remove(notification);
        } catch (e) {
            return response.status(e.httpCode).json({message: e.message})
        }
    }

}