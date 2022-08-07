'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);

module.exports = (app, articleService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit} = req.query;
    let articles;

    if (limit && offset) {
      articles = await articleService.findPage({limit, offset});
    } else {
      articles = await articleService.findAll();
    }

    res.status(HttpCode.OK).json(articles);
  });


  route.get(`/discussed`, async (req, res) => {
    const {count} = req.query;
    const articles = await articleService.findDiscussed(count);
    res.status(HttpCode.OK).json(articles);
  });


  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const {comments} = req.query;
    const article = await articleService.findOne(articleId, comments);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with id ${articleId}`);
      return;
    }

    res.status(HttpCode.OK).json(article);
  });


  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    res.status(HttpCode.CREATED).json(article);
  });


  route.put(`/:articleId`, articleValidator, async (req, res) => {
    const {articleId} = req.params;
    const updatedArticle = await articleService.update(articleId, req.body);

    if (!updatedArticle) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with id ${articleId}`);
      return;
    }

    res.status(HttpCode.OK).json(updatedArticle);
  });


  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with id ${articleId}`);
      return;
    }

    res.status(HttpCode.OK).json(article);
  });
};
