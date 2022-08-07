'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const commentValidator = require(`../middlewares/comment-validator`);
const articleExist = require(`../middlewares/article-exist`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);


  route.get(`/:articleId/comments`,
      articleExist(articleService),
      async (req, res) => {
        const {articleId} = req.params;
        const comments = await commentService.findAll(articleId);

        res.status(HttpCode.OK).json(comments);
      },
  );


  route.post(`/:articleId/comments`,
      [articleExist(articleService), commentValidator],
      (req, res) => {
        const {articleId} = req.params;
        commentService.create(articleId, req.body);

        res.status(HttpCode.CREATED).send(`Created`);
      },
  );


  route.delete(`/:articleId/comments/:commentId`,
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
  });
};
