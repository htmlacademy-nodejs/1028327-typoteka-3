'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const articleExist = require(`../middlewares/article-exist`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();
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

  route.get(
      `/:articleId/comments`,
      articleExist(articleService),
      (req, res) => {
        const {article} = res.locals;
        const comments = commentService.findAll(article);

        res.status(HttpCode.OK).json(comments);
      },
  );

  route.delete(
      `/:articleId/comments/:commentId`,
      articleExist(articleService),
      (req, res) => {
        const {article} = res.locals;
        const {commentId} = req.params;

        const comment = commentService.drop(article, commentId);

        if (!comment) {
          res.status(HttpCode.NOT_FOUND)
            .send(`Not found comment with id ${commentId}`);
          return;
        }

        res.status(HttpCode.OK).json(comment);
      },
  );

  route.post(
      `/:articleId/comments`,
      [articleExist(articleService), commentValidator],
      (req, res) => {
        const {article} = res.locals;
        const comment = commentService.create(article, req.body);

        res.status(HttpCode.CREATED).json(comment);
      },
  );
};
