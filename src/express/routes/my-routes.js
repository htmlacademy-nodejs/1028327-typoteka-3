'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  const comments = articles.reduce((acc, article) => {
    acc = [...acc, ...article.comments];
    return acc;
  }, []);
  res.render(`my`, {articles, comments});
});

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`comments`, {articles});
});

myRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = myRouter;
