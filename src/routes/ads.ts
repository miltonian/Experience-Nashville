import { Request, Response, Router } from 'express';
import { Article } from '../entity/Article';
import { getRepository, In } from 'typeorm';
import AdController from '../controller/AdController';
import UserController from '../controller/UserController';
import { checkJwt } from '../middleware/checkJwt';
import { checkRole } from '../middleware/checkRole';
const router = Router();
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import { ArticleTag } from '../entity/ArticleTag';
import { Ad } from '../entity/Ad';

//Get all articles
router.get('/', AdController.listAll);

router.post('/upload/:imageName', async (req, res) => {
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
        cb(null, `images/ads/${imageName}`);
      },
    }),
  }).single('ad');
  upload1(req, res, () => {
    res.json({ url: (req.file as any).location });
  });
});

router.put('/', async (req, res) => {
  const values: ArticleAPI.Ad = req.body.values;
  const adRepo = getRepository(Ad);

  let ad = values;

  if (values.id === -1) {
    ad = await adRepo.save({
      ...values,
      id: undefined,
    });
  } else {
    ad = await adRepo.save(values);
  }

  res.json(ad);
});

export default router;
