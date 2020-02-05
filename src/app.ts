import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import "reflect-metadata";
import {createExpressServer} from "routing-controllers";
import {UserController} from "./controller/UserController";
import {RoleController} from "./controller/RoleController";
import { AdvertisementController } from "./controller/AdvertisementController";
import { StatusController } from "./controller/StatusController";
import { TariffController } from "./controller/TariffController";
import { ChannelController } from "./controller/ChannelController";
import { UserChannelController } from "./controller/UserChannelController";
import { ChannelTariffController } from "./controller/ChannelTariffController";
import { AdvertisementChannelController } from "./controller/AdvertisementChannelController";
import { AdvertisementDateController } from "./controller/AdvertisementDateController";
const cors = require('cors')

const PORT = 5000;

createConnection().then(async connection => {

    // create express app
    const app = createExpressServer({
        cors: true,
        controllers: [
            RoleController, 
            UserController, 
            AdvertisementController,
            StatusController,
            TariffController,
            ChannelController,
            UserChannelController,
            ChannelTariffController,
            AdvertisementChannelController,
            AdvertisementDateController
        ]
    });
    // console.log(__dirname + "../controller/*.js")
    app.use(bodyParser.json());

    // register express routes from defined application routes
    // Routes.forEach(route => {
    //     (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
    //         const result = (new (route.controller as any))[route.action](req, res, next);
    //         if (result instanceof Promise) {
    //             result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

    //         } else if (result !== null && result !== undefined) {
    //             res.json(result);
    //         }
    //     });
    // });

    // setup express app here
    // ...

    // start express server
    app.listen(PORT);

    console.log(`Express server has started on port ${PORT}.`);

}).catch(error => console.log(error));
