'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const path = require(`path`);
const {ensureArray} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  },
});

const upload = multer({storage});
const articlesRoutes = new Router();

articlesRoutes.get(`/category/:id`, (req, res) => res.render(`all-categories`));

articlesRoutes.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`post-edit`, {categories});
});

articlesRoutes.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const articleData = {
    picture: file ? file.filename : ``,
    title: body.title,
    createdDate: body.date,
    сategory: ensureArray(body.categories),
    announce: body.announcement,
    text: body[`full-text`],
  };

  try {
    const article = await api.createArticle(articleData);
    res.redirect(`/articles/${article.id}`);
  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRoutes.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories(),
  ]);

  res.render(`post-edit`, {article, categories});
});

articlesRoutes.get(`/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id, true),
      api.getCategories(true),
    ]);

    const articleCategories = categories.filter(
        (category) => article.categories.some(
            (articleCategory) => articleCategory.id === category.id,
        ),
    );

    res.render(`post`, {article, categories: articleCategories});
  } catch (error) {
    res.status(error.response.status).render(`errors/404`);
  }
});

module.exports = articlesRoutes;
