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
import { ChannelAdminsController } from "./controller/ChannelAdminsController";
import { ChannelTariffController } from "./controller/ChannelTariffController";
import { AdvertisementChannelController } from "./controller/AdvertisementChannelController";
import { AdvertisementDateController } from "./controller/AdvertisementDateController";
import helmet = require("helmet");
import { AuthController } from "./controller/AuthController";
import { NotificationController } from "./controller/NotificationController";
import { checkRole } from "./middlewares/checkRole";
import { ChannelAgentsController } from "./controller/ChannelAgentsController";
import { Statistics } from "./controller/Statistics";

const PORT = 3000;


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
            ChannelAdminsController,
            ChannelTariffController,
            AdvertisementChannelController,
            AdvertisementDateController,
            AuthController,
            ChannelAgentsController,
            NotificationController,
            Statistics
        ],
        routePrefix: '/api',
        authorizationChecker: checkRole
    });
    // app.use(function (req, res, next) {

    //     // Website you wish to allow to connect
    //     res.setHeader('Access-Control-Allow-Origin', '*');
    
    //     // Request methods you wish to allow
    //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    //     // Request headers you wish to allow
    //     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    //     // Set to true if you need the website to include cookies in the requests sent
    //     // to the API (e.g. in case you use sessions)
    //     res.setHeader('Access-Control-Allow-Credentials', true);
    
    //     // Pass to next layer of middleware
    //     next();
    // });

    
    // app.use('/', express.static('dist'));
    // app.use('/create', express.static('dist'));
    // app.use('/users', express.static('dist'));
    // app.use(helmet());
    app.use('/uploads', express.static('uploads'));
    app.use(bodyParser.json());
    app.listen(PORT);

    console.log(`Express server has started on port ${PORT}.`);

}).catch(error => console.log(error));
