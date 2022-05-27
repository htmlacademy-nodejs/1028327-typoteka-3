'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);

const route = new Router();

module.exports = (app, articleService) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();
    res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with id ${articleId}`);
      return;
    }

    res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, articleValidator, (req, res) => {
    const {articleId} = req.params;
    const existArticle = articleService.findOne(articleId);

    if (!existArticle) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with id ${articleId}`);
      return;
    }

    const updatedArticle = articleService.update(articleId, req.body);

    res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.drop(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with id ${articleId}`);
      return;
    }

    res.status(HttpCode.OK).json(article);
  });
};
