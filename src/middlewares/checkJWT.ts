import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

const extractTokenFromHeader = (req: Request) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
}

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  
  //extract the jwt token from the Authorization header
  const token =  extractTokenFromHeader(req);
  let jwtPayload;
  
  //Try to validate the token and get data
  try {
    jwtPayload = jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send({response: "You should be logged in to access this url"});
    return;
  }
  //We refresh the token on every request by setting another 1h
  // const {data:{ userId, username, role }} = jwtPayload;
  const newToken = jwt.sign({userId: jwtPayload.userId, username: jwtPayload.username }, config.jwtSecret, {
    expiresIn: "1h"
  });
  res.setHeader("Authorization", 'Bearer ' + newToken);

  next();
}