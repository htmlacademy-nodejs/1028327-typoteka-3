'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const api = require(`../api`).getAPI();
const authorAuth = require(`../middlewares/author-auth`);
const {prepareErrors} = require(`../../utils`);

const myRouter = new Router();
const csrfProtection = csrf();


myRouter.get(`/`, authorAuth, async (req, res) => {
  const {user} = req.session;

  const articles = await api.getArticles();
  const comments = articles.reduce((acc, article) => {
    acc = [...acc, ...article.comments];
    return acc;
  }, []);

  res.render(`my`, {
    articles,
    comments,
    user,
  });
});


myRouter.get(`/comments`, authorAuth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles();

  res.render(`comments`, {
    articles,
    user,
  });
});


myRouter.get(`/categories`,
    [authorAuth, csrfProtection],
    async (req, res) => {
      const {user} = req.session;

      const categories = await api.getCategories();

      res.render(`all-categories`, {
        categories,
        user,
        csrfToken: req.csrfToken(),
      });
    },
);


myRouter.post(`/categories/add`,
    [authorAuth, csrfProtection],
    async (req, res) => {
      const {user} = req.session;
      const {body} = req;

      const categoryData = {
        name: body.category,
      };

      try {
        await api.createCategory(categoryData);
        res.redirect(`/my/categories`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const categories = await api.getCategories();

        res.render(`all-categories`, {
          categories,
          validationMessages,
          user,
          csrfToken: req.csrfToken(),
        });
      }
    },
);


myRouter.post(`/categories/:categoryId`,
    [authorAuth, csrfProtection],
    async (req, res) => {
      const {user} = req.session;
      const {categoryId} = req.params;
      const {body} = req;

      const categoryData = {
        name: body.category,
      };

      try {
        await api.editCategory(categoryId, categoryData);
        res.redirect(`/my/categories`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const categories = await api.getCategories();

        res.render(`all-categories`, {
          id: categoryId,
          categories,
          validationMessages,
          user,
          csrfToken: req.csrfToken(),
        });
      }
    },
);


myRouter.get(`/categories/delete/:categoryId`,
    [authorAuth, csrfProtection],
    async (req, res) => {
      const {user} = req.session;
      const {categoryId} = req.params;

      try {
        await api.removeCategory(categoryId);
        res.redirect(`/my/categories`);
      } catch (errors) {
        const categories = await api.getCategories();

        res.render(`all-categories`, {
          id: categoryId,
          categories,
          validationMessages: [errors.response.data.error],
          user,
          csrfToken: req.csrfToken(),
        });
      }
    },
);


module.exports = myRouter;
