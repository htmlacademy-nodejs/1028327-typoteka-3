'use strict';

const {Router} = require(`express`);
const {shuffle} = require(`../../utils`);
const api = require(`../api`).getAPI();

const mainRoutes = new Router();

mainRoutes.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  const categories = await api.getCategories();
  const comments = articles.reduce((acc, article) => {
    acc = [...acc, ...article.comments];
    return acc;
  }, []);

  res.render(`main`, {
    articles,
    comments: shuffle(comments).slice(0, 3),
    categories,
  });
});

mainRoutes.get(`/register`, (req, res) => res.render(`sign-up`));
mainRoutes.get(`/login`, (req, res) => res.render(`login`));

mainRoutes.get(`/search`, async (req, res) => {
  const {query} = req.query;

  if (!query) {
    res.render(`search`);
    return;
  }

  try {
    const articles = await api.search(query);
    res.render(`search`, {query, articles});
  } catch (error) {
    res.render(`search`, {query, articles: []});
  }
});

module.exports = mainRoutes;
