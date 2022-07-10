'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const articleExist = require(`../middlewares/article-exist`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const articles = await articleService.findAll();
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


  route.get(
      `/:articleId/comments`,
      articleExist(articleService),
      async (req, res) => {
        const {articleId} = req.params;
        const comments = await commentService.findAll(articleId);

        res.status(HttpCode.OK).json(comments);
      },
  );


  route.post(
      `/:articleId/comments`,
      [articleExist(articleService), commentValidator],
      (req, res) => {
        const {articleId} = req.params;
        commentService.create(articleId, req.body);

        res.status(HttpCode.CREATED).send(`Created`);
      },
  );


  route.delete(
      `/:articleId/comments/:commentId`,
      articleExist(articleService),
      async (req, res) => {
        const {commentId} = req.params;
        const deleted = await commentService.drop(commentId);

        if (!deleted) {
          res.status(HttpCode.NOT_FOUND)
            .send(`Not found comment with id ${commentId}`);
          return;
        }

        res.status(HttpCode.OK).send(`Deleted`);
      },
  );

  app.get(`/comments`, async (req, res) => {
    const {count} = req.query;
    const comments = await commentService.findLatest(count);

    res.status(HttpCode.OK).json(comments);
  },
  );
};
