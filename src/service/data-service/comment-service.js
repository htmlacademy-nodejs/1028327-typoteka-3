'use strict';

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
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

  // TODO: для Дмитрия / оставить здесь или это больше ArticleService?
  findLatest(count) {
    return this._Comment.findAll({
      attributes: [
        `text`,
        `createdAt`,
        `ArticleId`,
      ],
      order: [
        [`createdAt`, `DESC`],
      ],
      limit: count,
      raw: true,
    });
  }
}

module.exports = CommentService;
