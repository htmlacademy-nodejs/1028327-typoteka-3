'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const myRouter = new Router();


myRouter.get(`/`, async (req, res) => {
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


myRouter.get(`/comments`, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles();

  res.render(`comments`, {
    articles,
    user,
  });
});


myRouter.get(`/categories`, (req, res) => {
  const {user} = req.session;

  res.render(`all-categories`, {
    user,
  });
});


module.exports = myRouter;
