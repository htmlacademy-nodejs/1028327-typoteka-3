'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const authorAuth = require(`../middlewares/author-auth`);

const myRouter = new Router();


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


myRouter.get(`/categories`, authorAuth, (req, res) => {
  const {user} = req.session;

  res.render(`all-categories`, {
    user,
  });
});


module.exports = myRouter;
