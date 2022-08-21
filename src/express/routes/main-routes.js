'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {adaptToClient} = require(`../../service/lib/adapt-to-client`);
const {prepareErrors} = require(`../../utils`);
const {
  MAX_LAST_COMMENTS,
  MAX_DISCUSSED_ARTICLES,
  ARTICLES_PER_PAGE,
} = require(`../../constants`);

const mainRoutes = new Router();
const csrfProtection = csrf();


mainRoutes.get(`/`, async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

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

  const [
    adaptedArticles,
    adaptedComments,
  ] = adaptToClient(mostDiscussedArticles, lastestComments);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main`, {
    articles,
    categories,
    mostDiscussedArticles: adaptedArticles,
    lastestComments: adaptedComments,
    page,
    totalPages,
    user,
  });
});


mainRoutes.get(`/register`, csrfProtection, (req, res) => {
  const {user} = req.session;

  if (user) {
    res.redirect(`/`);
  } else {
    res.render(`sign-up`, {
      csrfToken: req.csrfToken(),
    });
  }
});


mainRoutes.post(`/register`,
    [upload.single(`avatar`), csrfProtection],
    async (req, res) => {
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

        res.render(`sign-up`, {
          validationMessages,
          csrfToken: req.csrfToken(),
        });
      }
    },
);


mainRoutes.get(`/login`, csrfProtection, (req, res) => {
  const {user} = req.session;

  if (user) {
    res.redirect(`/`);
  } else {
    res.render(`login`, {
      csrfToken: req.csrfToken(),
    });
  }
});


mainRoutes.post(`/login`, csrfProtection, async (req, res) => {
  const {body} = req;

  const loginData = {
    email: body.email,
    password: body.password,
  };

  try {
    req.session.user = await api.auth(loginData);
    req.session.save(() => res.redirect(`/`));
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;

    res.render(`login`, {
      user,
      validationMessages,
      csrfToken: req.csrfToken(),
    });
  }
});


mainRoutes.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/login`);
});


mainRoutes.get(`/search`, async (req, res) => {
  const {user} = req.session;
  const {query} = req.query;

  if (!query) {
    res.render(`search`, {
      user,
    });

    return;
  }

  try {
    const articles = await api.search(query);

    res.render(`search`, {
      query,
      articles,
      user,
    });
  } catch (error) {
    res.render(`search`, {
      query,
      articles: [],
      user,
    });
  }
});


module.exports = mainRoutes;
