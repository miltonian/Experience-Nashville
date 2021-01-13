"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const User_1 = require("../entity/User");
const config_1 = __importDefault(require("../config/config"));
class AuthController {
}
AuthController.login = async (req, res) => {
    //Check if username and password are set
    let { username, password } = req.body;
    if (!(username && password)) {
        res.status(400).send();
        return;
    }
    //Get user from database
    const userRepository = typeorm_1.getRepository(User_1.User);
    let user;
    try {
        user = await userRepository.findOneOrFail({ where: { username } });
    }
    catch (error) {
        res.status(401).send();
        return;
    }
    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        res.status(401).send();
        return;
    }
    //Sing JWT, valid for 1 hour
    const token = jwt.sign({ userId: user.id, username: user.username }, config_1.default.jwtSecret, { expiresIn: '1h' });
    //Send the jwt in the response
    res.send(token);
};
AuthController.changePassword = async (req, res) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;
    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
        res.status(400).send();
    }
    //Get user from the database
    const userRepository = typeorm_1.getRepository(User_1.User);
    let user;
    try {
        user = await userRepository.findOneOrFail(id);
    }
    catch (id) {
        res.status(401).send();
    }
    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
        res.status(401).send();
        return;
    }
    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await class_validator_1.validate(user);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);
    res.status(204).send();
};
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map