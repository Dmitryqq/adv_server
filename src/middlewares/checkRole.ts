import { getCustomRepository, getRepository } from "typeorm";
import { User } from "../entity/User";
import { Action } from "routing-controllers";
import { Role } from "../entity/Role";

export const checkRole = async (action: Action, roles: Array<string>) => {
    let userRepository = getRepository(User);
    //Get the Express Response object from Routing-controllers Action
    let res = action.response;
    //Get the user ID stored on the response object by the checkJwt middleware
    const id = res.locals.jwtPayload.userId;

    //Find user role in the database
    // let userRepository = getCustomRepository(UserRepository);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id, { relations: ["role"] });
    } catch (id) {
      return false;
    }
    if (user && !roles.length)
        return true;
    //Check if array of authorized roles includes the user's role
    if (roles.indexOf(user.role.name) > -1) return true;
    else return false;
};