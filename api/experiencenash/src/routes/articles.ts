import { Request, Response, Router } from 'express';
import { Article } from '../entity/Article';
import { getRepository, In } from 'typeorm';
import ArticleController from '../controller/ArticleController';
import UserController from '../controller/UserController';
import { checkJwt } from '../middleware/checkJwt';
import { checkRole } from '../middleware/checkRole';
const router = Router();
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import { ArticleTag } from '../entity/ArticleTag';

//Get all articles
router.get('/', ArticleController.listAll);
router.get('/public', ArticleController.listAllPublic);
router.get('/tags', ArticleController.allTags);

router.post('/image/:imageName', async (req, res) => {
  const { imageName } = req.params;

  const s3 = new aws.S3({
    credentials: {
      accessKeyId: process.env.AWS_KEY_ID,
      secretAccessKey: process.env.AWS_ACCESS_KEY,
    },
  });

  const upload1 = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET,
      acl: 'public-read',
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        cb(null, `images/articles/${imageName}`);
      },
    }),
  }).single('article');
  upload1(req, res, () => {
    res.json({ url: (req.file as any).location });
  });
});

// Get one article
router.get(
  '/:id',
  //   [checkJwt, checkRole(['ADMIN'])],
  async (req, res) => {
    const id = Number(req.params.id);
    const articleRepo = getRepository(Article);
    const article = await articleRepo.findOne(id);
    res.json(article);
  }
);

// //Create a new user
// router.post('/', [checkJwt, checkRole(['ADMIN'])], UserController.newUser);
router.post('/', async (req, res) => {
  //Get articles from database
  const values = req.body.values;
  const articleRepo = getRepository(Article);
  const tagRepo = getRepository(ArticleTag);

  let article = values;

  if (values.id === -1) {
    article = await articleRepo.save({
      ...values,
      id: undefined,
      createdAt: new Date(),
      authorId: 2,
      tags: undefined,
    });
  } else {
    article = await articleRepo.save({
      ...values,
      createdAt: new Date(),
      authorId: 2,
      tags: undefined,
    });
  }

  // add tags
  const tagNames = values.tags.map((t: ArticleAPI.ArticleTag) => t.name);

  const articleTags = await tagRepo.find({
    where: { articleId: article.id },
  });
  const foundTags = articleTags.filter((t) => tagNames.includes(t.name));
  const deleteTags = articleTags
    .filter((t) => !tagNames.includes(t.name))
    .map((t) => t.id);
  const insertVals = values.tags
    .filter(
      (t: ArticleAPI.ArticleTag) =>
        !foundTags.map((t) => t.name).includes(t.name)
    )
    .map((t: ArticleAPI.ArticleTag) => ({
      name: t.name,
      articleId: article.id,
    }));
  await tagRepo.delete({ articleId: article.id, id: In(deleteTags) });

  await tagRepo.createQueryBuilder().insert().values(insertVals).execute();

  res.json(await articleRepo.findOne(article.id));
});

// //Edit one user
// router.patch(
//   '/:id([0-9]+)',
//   [checkJwt, checkRole(['ADMIN'])],
//   UserController.editUser
// );

// //Delete one user
// router.delete(
//   '/:id([0-9]+)',
//   [checkJwt, checkRole(['ADMIN'])],
//   UserController.deleteUser
// );

export default router;
