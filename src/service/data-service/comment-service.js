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

  findListAll() {
    return this._Comment.findAll({raw: true});
  }
}

module.exports = CommentService;
