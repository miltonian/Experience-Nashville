import { Router, Request, Response } from 'express';
import auth from './auth';
import user from './user';
import article from './articles';
import ad from './ads';

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/articles', article);
routes.use('/ads', ad);

export default routes;
