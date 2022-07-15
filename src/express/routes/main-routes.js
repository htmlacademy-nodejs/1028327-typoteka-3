'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {
  MAX_LAST_COMMENTS,
  MAX_DISCUSSED_ARTICLES,
} = require(`../../constants`);

const mainRoutes = new Router();

mainRoutes.get(`/`, async (req, res) => {
  const [
    articles,
    categories,
    lastestComments,
    mostDiscussedArticles,
  ] = await Promise.all([
    api.getArticles(),
    api.getCategories(true),
    api.getLatestComments(MAX_LAST_COMMENTS),
    api.getMostDiscussedArticles(MAX_DISCUSSED_ARTICLES),
  ]);

  res.render(`main`, {
    articles,
    categories,
    lastestComments,
    mostDiscussedArticles,
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
