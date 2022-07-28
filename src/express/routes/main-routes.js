'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);
const {
  MAX_LAST_COMMENTS,
  MAX_DISCUSSED_ARTICLES,
  OFFERS_PER_PAGE,
} = require(`../../constants`);

const mainRoutes = new Router();


mainRoutes.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [
    {count, articles},
    categories,
    lastestComments,
    mostDiscussedArticles,
  ] = await Promise.all([
    api.getArticles({limit, offset}),
    api.getCategories(true),
    api.getLatestComments(MAX_LAST_COMMENTS),
    api.getMostDiscussedArticles(MAX_DISCUSSED_ARTICLES),
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`main`, {
    articles,
    categories,
    lastestComments,
    mostDiscussedArticles,
    page,
    totalPages,
  });
});


mainRoutes.get(`/register`, (req, res) => res.render(`sign-up`));


mainRoutes.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const userData = {
    avatar: file ? file.filename : ``,
    name: `${body.name} ${body.surname}`,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`sign-up`, {validationMessages});
  }
});


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
