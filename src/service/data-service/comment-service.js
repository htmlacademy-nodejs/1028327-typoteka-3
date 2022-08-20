'use strict';

const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment,
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({where: {id}});
    return !!deletedRows;
  }

  findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true,
    });
  }

  findLatest(limit) {
    const otions = {
      attributes: [
        `id`,
        `text`,
        `createdAt`,
        `articleId`,
      ],
      order: [
        [`createdAt`, `DESC`],
      ],
      include: [
        {
          model: this._User,
          as: Aliase.USER,
          attributes: [
            `id`,
            `name`,
            `avatar`,
          ],
        },
      ],
    };

    if (limit) {
      otions.limit = limit;
    } else {
      otions.include.push({
        model: this._Article,
        as: Aliase.ARTICLE,
        attributes: [
          `title`,
        ],
      });
    }

    return this._Comment.findAll(otions);
  }
}

module.exports = CommentService;
