'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my`, {articles});
});

myRouter.get(`/comments`, (req, res) => res.render(`comments`));
myRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = myRouter;
