'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit} = req.query;
    let articles;

    if (limit && offset) {
      articles = await service.findPage({limit, offset});
    } else {
      articles = await service.findAll();
    }

    res.status(HttpCode.OK).json(articles);
  });


  route.get(`/discussed`, async (req, res) => {
    const {limit} = req.query;
    const articles = await service.findDiscussed(limit);
    res.status(HttpCode.OK).json(articles);
  });


  route.get(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId} = req.params;
    const {comments} = req.query;
    const article = await service.findOne(articleId, comments);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with id ${articleId}`);
      return;
    }

    res.status(HttpCode.OK).json(article);
  });


  route.post(`/`, articleValidator, async (req, res) => {
    const article = await service.create(req.body);

    res.status(HttpCode.CREATED).json(article);
  });


  route.put(`/:articleId`,
      [routeParamsValidator, articleValidator],
      async (req, res) => {
        const {articleId} = req.params;
        const updatedArticle = await service.update(articleId, req.body);

        if (!updatedArticle) {
          res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with id ${articleId}`);
          return;
        }

        res.status(HttpCode.OK).json(updatedArticle);
      },
  );


  route.delete(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId} = req.params;
    const article = await service.drop(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with id ${articleId}`);
      return;
    }

    res.status(HttpCode.OK).json(article);
  });
};
