import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { JsonController, Get, Post, Delete, NotFoundError, Req, Res, Body, UseBefore, UseAfter } from "routing-controllers";
import {Channel} from "../entity/Channel";
const multer  = require('multer')

var newFileName = null;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        let fileType = file.originalname.split('.').pop();
        newFileName = file.fieldname + '-' + Date.now() + '.' + fileType;
        cb(null, newFileName)
    }
  })

  const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb('Only .png, .jpg and .jpeg format allowed!');
        }
    },
    limits: {
        fileSize: 1500000
    }
})

@JsonController()
export class ChannelController {

    private channelRepository = getRepository(Channel);

    @Get("/channels")
    async all(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            return await this.channelRepository.find();
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Get("/channels/:id")
    async one(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            let channel = await this.channelRepository.findOne(request.params.id);
            if (!channel)
                throw new NotFoundError('Channel was not found.')
            return channel;
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Post("/channels")
    async save(@Body({ required: true }) channel: any, @Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            let channel = request.body
            if(channel.id)
                channel.update_date = new Date().toLocaleString();
            return this.channelRepository.save(channel);
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Post("/channel/logo")
    @UseBefore(upload.single('logo'))
    async uploadLogo(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try{
            if(!request.file){
                return response.send({
                    success: false
                });
            } else {
                return response.send({
                    success: true,
                    filename: request.file.filename
                });
            }
        }
        catch(e){
            return response.status(e.httpCode).json({message: e.message})
        }
    }

    @Delete("/channels/:id")
    async remove(@Req() request: Request, @Res() response: Response, next: NextFunction) {
        try {
            let channelToRemove = await this.channelRepository.findOne(request.params.id);
            if (!channelToRemove)
                throw new NotFoundError('Channel was not found.')
            await this.channelRepository.remove(channelToRemove);
        } catch (e) {
            return response.status(e.httpCode).json({message: e.message})
        }
    }

}