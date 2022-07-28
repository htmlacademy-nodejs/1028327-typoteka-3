'use strict';

const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  create(articleId, comment) {
    return this._Comment.create({
      ArticleId: articleId,
      ...comment,
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({where: {id}});
    return !!deletedRows;
  }

  findAll(articleId) {
    return this._Comment.findAll({
      where: {ArticleId: articleId},
      raw: true,
    });
  }

  findLatest(count) {
    return this._Comment.findAll({
      attributes: [
        `text`,
        `createdAt`,
        `ArticleId`, // TODO: 2022-07-27 / change name field
      ],
      order: [
        [`createdAt`, `DESC`],
      ],
      limit: count,
      include: [{
        model: this._User,
        as: Aliase.USER,
        attributes: [
          `id`,
          `name`,
          `avatar`,
        ],
      }],
    });
  }
}

module.exports = CommentService;
