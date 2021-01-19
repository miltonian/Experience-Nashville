import { Request, Response } from 'express';
import { getRepository, IsNull } from 'typeorm';
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

  static listAllPublic = async (req: Request, res: Response) => {
    const articleRepository = getRepository(Article);
    const articles = await articleRepository
      .createQueryBuilder()
      .where(`"scheduledAt" IS NULL OR "scheduledAt" <= NOW()`)
      .orderBy(`"scheduledAt"`)
      .addOrderBy(`"createdAt"`, 'DESC')
      .getMany();

    res.json(articles);
  };

  static allTags = async (req: Request, res: Response) => {
    const tagsRepository = getRepository(ArticleTag);
    const tags = uniq(
      (await tagsRepository.createQueryBuilder().getMany()).map((t) => t.name)
    );
    res.json(tags);
  };
}

export default ArticleController;
