import { Router, Request, Response } from 'express';
import auth from './auth';
import user from './user';
import article from './articles';

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/articles', article);

export default routes;
