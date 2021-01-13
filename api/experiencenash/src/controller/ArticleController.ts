import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import { Article } from '../entity/Article';
import { ArticleTag } from '../entity/ArticleTag';
import { uniq } from 'lodash';

class ArticleController {
  static listAll = async (req: Request, res: Response) => {
    const articleRepository = getRepository(Article);
    const articles = await articleRepository.find();

    res.json(articles);
  };

  static allTags = async (req: Request, res: Response) => {
    const tagsRepository = getRepository(ArticleTag);
    const tags = await tagsRepository
      .createQueryBuilder()
      .groupBy('name')
      .getMany();
    res.json(tags);
  };
}

export default ArticleController;
