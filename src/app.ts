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
import helmet = require("helmet");
import { AuthController } from "./controller/AuthController";
import { checkRole } from "./middlewares/checkRole";

const PORT = 5000;

createConnection().then(async connection => {

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
            AdvertisementDateController,
            AuthController
        ],
        authorizationChecker: checkRole
    });
    
    // app.use(helmet());
    app.use(bodyParser.json());

    app.listen(PORT);

    console.log(`Express server has started on port ${PORT}.`);

}).catch(error => console.log(error));
