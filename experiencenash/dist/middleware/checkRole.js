"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
const checkRole = (roles) => {
    return async (req, res, next) => {
        //Get the user ID from previous midleware
        const id = res.locals.jwtPayload.userId;
        //Get user role from the database
        const userRepository = typeorm_1.getRepository(User_1.User);
        let user;
        try {
            user = await userRepository.findOneOrFail(id);
        }
        catch (id) {
            res.status(401).send();
        }
        //Check if array of authorized roles includes the user's role
        if (roles.indexOf(user.role) > -1)
            next();
        else
            res.status(401).send();
    };
};
exports.checkRole = checkRole;
//# sourceMappingURL=checkRole.js.map