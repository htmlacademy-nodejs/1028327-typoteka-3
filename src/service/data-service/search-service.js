'use strict';

const {Op} = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
  }

  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText,
        },
      },
      // TODO: 2022-07-07 / вероятно категории не нужны
      include: [Aliase.CATEGORIES],
      order: [
        [`createdAt`, `DESC`],
      ],
    });
    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
