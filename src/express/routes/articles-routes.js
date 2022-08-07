'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const userAuth = require(`../middlewares/user-auth`);
const authorAuth = require(`../middlewares/author-auth`);
const {
  ensureArray,
  prepareErrors,
} = require(`../../utils`);

const getShortArticleData = async (articleId) => await Promise.all([
  api.getArticle(articleId),
  api.getCategories(),
]);

const getFullArticleData = async (articleId) => await Promise.all([
  api.getArticle(articleId, true),
  api.getCategories(true),
]);

const articlesRoutes = new Router();
const csrfProtection = csrf();


articlesRoutes.get(`/category/:id`, (req, res) => {
  const {user} = req.session;

  res.render(`all-categories`, {
    user,
  });
});


articlesRoutes.get(`/add`, authorAuth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();

  res.render(`article-edit`, {
    categories,
    user,
    csrfToken: req.csrfToken(),
  });
});


articlesRoutes.post(`/add`,
    authorAuth,
    upload.single(`upload`),
    csrfProtection,
    async (req, res) => {
      const {user} = req.session;
      const {body, file} = req;

      const articleData = {
        userId: user.id,
        picture: file ? file.filename : null,
        title: body.title,
        date: body.date,
        categories: ensureArray(body.categories),
        announce: body.announcement,
        text: body.text ? body.text : null,
      };

      try {
        const article = await api.createArticle(articleData);
        res.redirect(`/articles/${article.id}`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const categories = await api.getCategories();

        res.render(`article-edit`, {
          categories,
          validationMessages,
          user,
          csrfToken: req.csrfToken(),
        });
      }
    },
);


articlesRoutes.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  try {
    const [article, categories] = await getFullArticleData(id);

    const articleCategories = categories.filter(
        (category) => article.categories.some(
            (articleCategory) => articleCategory.id === category.id,
        ),
    );

    res.render(`article`, {
      id,
      article,
      categories: articleCategories,
      user,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    res.status(error.response.status).render(`errors/404`, {
      user,
    });
  }
});


articlesRoutes.get(`/edit/:id`,
    authorAuth,
    csrfProtection,
    async (req, res) => {
      const {user} = req.session;
      const {id} = req.params;
      const [article, categories] = await getShortArticleData(id);

      res.render(`article-edit`, {
        id,
        article,
        categories,
        user,
        csrfToken: req.csrfToken(),
      });
    },
);


articlesRoutes.post(`/edit/:id`,
    authorAuth,
    upload.single(`upload`),
    csrfProtection,
    async (req, res) => {
      const {user} = req.session;
      const {body, file} = req;
      const {id} = req.params;

      const articleData = {
        userId: user.id,
        picture: (file && file.filename) || (body.photo || null),
        title: body.title,
        date: body.date,
        categories: ensureArray(body.categories),
        announce: body.announcement,
        text: body.text ? body.text : null,
      };

      try {
        await api.editArticle(id, articleData);
        res.redirect(`/articles/${id}`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const [article, categories] = await getShortArticleData(id);

        res.render(`article-edit`, {
          id,
          article,
          categories,
          validationMessages,
          user,
          csrfToken: req.csrfToken(),
        });
      }
    },
);


articlesRoutes.post(`/:id/comments`,
    userAuth,
    upload.none(),
    csrfProtection,
    async (req, res) => {
      const {user} = req.session;
      const {id} = req.params;
      const {comment} = req.body;

      try {
        await api.createComment(id, {
          text: comment,
          userId: user.id,
        });

        res.redirect(`/articles/${id}`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const [article, categories] = await getFullArticleData(id);

        res.render(`article`, {
          id,
          article,
          categories,
          validationMessages,
          user,
          csrfToken: req.csrfToken(),
        });
      }
    },
);


module.exports = articlesRoutes;
