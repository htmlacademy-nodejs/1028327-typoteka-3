'use strict';

const {Router} = require(`express`);
const articleExist = require(`../middlewares/article-exist`);
const commentValidator = require(`../middlewares/comment-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);
const {adaptToClient} = require(`../lib/adapt-to-client`);
const {
  HttpCode,
  MAX_LAST_COMMENTS,
  MAX_DISCUSSED_ARTICLES,
} = require(`../../constants`);


module.exports = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);


  route.get(`/:articleId/comments`,
      routeParamsValidator,
      articleExist(articleService),
      async (req, res) => {
        const {articleId} = req.params;
        const comments = await commentService.findAll(articleId);

        res.status(HttpCode.OK).json(comments);
      },
  );


  route.post(`/:articleId/comments`,
      [routeParamsValidator, articleExist(articleService), commentValidator],
      async (req, res) => {
        const {articleId} = req.params;
        await commentService.create(articleId, req.body);

        const [
          mostDiscussed,
          lastestComments,
        ] = await Promise.all([
          articleService.findDiscussed(MAX_DISCUSSED_ARTICLES),
          commentService.findLatest(MAX_LAST_COMMENTS),
        ]);

        const [
          adaptedArticles,
          adaptedComments,
        ] = adaptToClient(mostDiscussed, lastestComments);

        const io = req.app.locals.socketio;
        io.emit(`comment:update`, {
          mostDiscussed: adaptedArticles,
          lastestComments: adaptedComments,
        });

        res.status(HttpCode.CREATED).send(`Created`);
      },
  );


  route.delete(`/comments/:commentId`,
      routeParamsValidator,
      async (req, res) => {
        const {commentId} = req.params;
        const deleted = await commentService.drop(commentId);

        if (!deleted) {
          res.status(HttpCode.NOT_FOUND)
            .send(`Not found comment with id ${commentId}`);
          return;
        }

        const [
          mostDiscussed,
          lastestComments,
        ] = await Promise.all([
          articleService.findDiscussed(MAX_DISCUSSED_ARTICLES),
          commentService.findLatest(MAX_LAST_COMMENTS),
        ]);

        const [
          adaptedArticles,
          adaptedComments,
        ] = adaptToClient(mostDiscussed, lastestComments);

        const io = req.app.locals.socketio;
        io.emit(`comment:update`, {
          mostDiscussed: adaptedArticles,
          lastestComments: adaptedComments,
        });

        res.status(HttpCode.OK).send(`Deleted`);
      },
  );


  app.get(`/comments`, async (req, res) => {
    const {limit} = req.query;
    const comments = await commentService.findLatest(limit);

    res.status(HttpCode.OK).json(comments);
  });
};
