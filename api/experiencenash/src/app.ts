import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import { Request, Response } from 'express';
import routes from './routes';
import { User } from './entity/User';

const app = express();

createConnection()
  .then(async (connection) => {
    // create express app
    app.use(helmet());
    app.use(bodyParser.json());

    // register express routes from defined application routes
    app.use('/', routes);
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

    console.log(
      'Express server has started on port 4000. Open http://localhost:4000/users to see results'
    );
  })
  .catch((error) => console.log(error));

export default app;
