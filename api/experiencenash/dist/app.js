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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
const app = express_1.default();
typeorm_1.createConnection()
    .then(async (connection) => {
    // create express app
    app.use(helmet_1.default());
    app.use(bodyParser.json());
    // register express routes from defined application routes
    app.use('/', routes_1.default);
    // Routes.forEach((route) => {
    //   (app as any)[route.method](
    //     route.route,
    //     (req: Request, res: Response, next: Function) => {
    //       const result = new (route.controller as any)()[route.action](
    //         req,
    //         res,
    //         next
    //       );
    //       if (result instanceof Promise) {
    //         result.then((result) =>
    //           result !== null && result !== undefined
    //             ? res.send(result)
    //             : undefined
    //         );
    //       } else if (result !== null && result !== undefined) {
    //         res.json(result);
    //       }
    //     }
    //   );
    // });
    // setup express app here
    // ...
    app.get('/hey', (req, res) => res.send('ho!'));
    // start express server
    app.listen(4000);
    // insert new users for test
    // await connection.manager.save(
    //   connection.manager.create(User, {
    //     username: 'Timber',
    //     role: 'user',
    //   })
    // );
    // await connection.manager.save(
    //   connection.manager.create(User, {
    //     username: 'Phantom',
    //     role: 'admin',
    //   })
    // );
    console.log('Express server has started on port 4000. Open http://localhost:4000/users to see results');
})
    .catch((error) => console.log(error));
exports.default = app;
//# sourceMappingURL=app.js.map