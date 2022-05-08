'use strict';

const {Router} = require(`express`);

const mainRoutes = new Router();

mainRoutes.get(`/`, (req, res) => res.render(`main`));
mainRoutes.get(`/register`, (req, res) => res.render(`sign-up`));
mainRoutes.get(`/login`, (req, res) => res.render(`login`));
mainRoutes.get(`/search`, (req, res) => res.render(`search`));
mainRoutes.get(`/404`, (req, res) => res.render(`errors/404`));
mainRoutes.get(`/500`, (req, res) => res.render(`errors/500`));

module.exports = mainRoutes;
