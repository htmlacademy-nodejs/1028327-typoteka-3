'use strict';

const {Router} = require(`express`);

const articlesRoutes = new Router();

articlesRoutes.get(`/category/:id`, (req, res) => res.render(`all-categories`));
articlesRoutes.get(`/add`, (req, res) => res.render(`post`));
articlesRoutes.get(`/edit/:id`, (req, res) => res.render(`post`));
articlesRoutes.get(`/:id`, (req, res) => res.render(`post-detail`));

module.exports = articlesRoutes;
