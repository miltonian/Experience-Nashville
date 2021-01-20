import { Request, Response } from 'express';
import { getRepository, IsNull } from 'typeorm';
import { validate } from 'class-validator';

import { ArticleTag } from '../entity/ArticleTag';
import { uniq } from 'lodash';
import { Ad } from '../entity/Ad';

class AdController {
  static listAll = async (req: Request, res: Response) => {
    const adRepository = getRepository(Ad);
    const ads = await adRepository.find();

    res.json(ads);
  };
}

export default AdController;
