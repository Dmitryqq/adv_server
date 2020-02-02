import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Tariff} from "../entity/Tariff";
import { JsonController, Get, NotFoundError, Req, Res } from "routing-controllers";

@JsonController()
export class TariffController {

    private tariffRepository = getRepository(Tariff);

    @Get("/tariffs")
    async all(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            return this.tariffRepository.find();
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Get("/tariffs/:id")
    async one(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            let tariff = await this.tariffRepository.findOne(request.params.id);
            if (!tariff)
                throw new NotFoundError('Tariff was not found.')
            return tariff;
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    // async save(request: Request, response: Response, next: NextFunction) {
    //     return this.tariffRepository.save(request.body);
    // }

    // async remove(request: Request, response: Response, next: NextFunction) {
    //     let userToRemove = await this.tariffRepository.findOne(request.params.id);
    //     await this.tariffRepository.remove(userToRemove);
    // }
}