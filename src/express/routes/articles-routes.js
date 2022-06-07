'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const articlesRoutes = new Router();

articlesRoutes.get(`/category/:id`, (req, res) => res.render(`all-categories`));
articlesRoutes.get(`/add`, (req, res) => res.render(`post`));
articlesRoutes.get(`/edit/:id`, (req, res) => res.render(`post`));

articlesRoutes.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);

  res.render(`post-detail`, {article, categories: article.сategory});
});

module.exports = articlesRoutes;
