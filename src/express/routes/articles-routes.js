'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const path = require(`path`);
const {
  ensureArray,
  prepareErrors,
} = require(`../../utils`);

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

const getShortArticleData = async (articleId) => await Promise.all([
  api.getArticle(articleId),
  api.getCategories(),
]);


const getFullArticleData = async (articleId) => await Promise.all([
  api.getArticle(articleId, true),
  api.getCategories(true),
]);

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
    date: body.date,
    categories: ensureArray(body.categories),
    announce: body.announcement,
    text: body.text,
  };

  try {
    const article = await api.createArticle(articleData);
    res.redirect(`/articles/${article.id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();

    res.render(`post-edit`, {
      categories,
      validationMessages,
    });
  }
});


articlesRoutes.get(`/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    const [article, categories] = await getFullArticleData(id);

    const articleCategories = categories.filter(
        (category) => article.categories.some(
            (articleCategory) => articleCategory.id === category.id,
        ),
    );

    res.render(`post`, {
      id,
      article,
      categories: articleCategories,
    });
  } catch (error) {
    res.status(error.response.status).render(`errors/404`);
  }
});


articlesRoutes.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await getShortArticleData(id);

  res.render(`post-edit`, {
    id,
    article,
    categories,
  });
});


articlesRoutes.post(`/edit/:id`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;

  const articleData = {
    picture: file ? file.filename : body.photo,
    title: body.title,
    date: body.date,
    categories: ensureArray(body.categories),
    announce: body.announcement,
    text: body.text,
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await getShortArticleData(id);

    res.render(`post-edit`, {
      id,
      article,
      categories,
      validationMessages,
    });
  }
});


articlesRoutes.post(`/:id/comments`, upload.none(), async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await getFullArticleData(id);

    res.render(`post`, {
      id,
      article,
      categories,
      validationMessages,
    });
  }
});

module.exports = articlesRoutes;
