"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const User_1 = require("../entity/User");
class UserController {
}
UserController.listAll = async (req, res) => {
    res.json({ success: true });
    return;
    //Get users from database
    const userRepository = typeorm_1.getRepository(User_1.User);
    const users = await userRepository.find({
        select: ['id', 'username', 'role'],
    });
    //Send the users object
    res.send(users);
};
UserController.getOneById = async (req, res) => {
    //Get the ID from the url
    const id = Number(req.params.id);
    //Get the user from database
    const userRepository = typeorm_1.getRepository(User_1.User);
    try {
        const user = await userRepository.findOneOrFail(id, {
            select: ['id', 'username', 'role'],
        });
    }
    catch (error) {
        res.status(404).send('User not found');
    }
};
UserController.newUser = async (req, res) => {
    //Get parameters from the body
    let { username, password, role } = req.body;
    let user = new User_1.User();
    user.username = username;
    user.password = password;
    user.role = role;
    //Validade if the parameters are ok
    const errors = await class_validator_1.validate(user);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    //Hash the password, to securely store on DB
    user.hashPassword();
    //Try to save. If fails, the username is already in use
    const userRepository = typeorm_1.getRepository(User_1.User);
    try {
        await userRepository.save(user);
    }
    catch (e) {
        res.status(409).send('username already in use');
        return;
    }
    //If all ok, send 201 response
    res.status(201).send('User created');
};
UserController.editUser = async (req, res) => {
    //Get the ID from the url
    const id = req.params.id;
    //Get values from the body
    const { username, role } = req.body;
    //Try to find user on database
    const userRepository = typeorm_1.getRepository(User_1.User);
    let user;
    try {
        user = await userRepository.findOneOrFail(id);
    }
    catch (error) {
        //If not found, send a 404 response
        res.status(404).send('User not found');
        return;
    }
    //Validate the new values on model
    user.username = username;
    user.role = role;
    const errors = await class_validator_1.validate(user);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    //Try to safe, if fails, that means username already in use
    try {
        await userRepository.save(user);
    }
    catch (e) {
        res.status(409).send('username already in use');
        return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
};
UserController.deleteUser = async (req, res) => {
    //Get the ID from the url
    const id = req.params.id;
    const userRepository = typeorm_1.getRepository(User_1.User);
    let user;
    try {
        user = await userRepository.findOneOrFail(id);
    }
    catch (error) {
        res.status(404).send('User not found');
        return;
    }
    userRepository.delete(id);
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
};
exports.default = UserController;
//# sourceMappingURL=UserController.js.map