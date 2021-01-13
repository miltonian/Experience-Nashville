"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const UserController_1 = __importDefault(require("./controller/UserController"));
exports.Routes = [
    {
        method: 'get',
        route: '/users',
        controller: UserController_1.default,
        action: 'all',
    },
    {
        method: 'get',
        route: '/users/:id',
        controller: UserController_1.default,
        action: 'one',
    },
    {
        method: 'post',
        route: '/users',
        controller: UserController_1.default,
        action: 'save',
    },
    {
        method: 'delete',
        route: '/users/:id',
        controller: UserController_1.default,
        action: 'remove',
    },
];
//# sourceMappingURL=routes_old.js.map