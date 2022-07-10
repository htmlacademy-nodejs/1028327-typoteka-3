'use strict';

const {Op} = require(`sequelize`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
  }

  // TODO: для Дмитрия / не могу сконфигурировать
  // LOWER LIKE для регистронезависимого поиска
  // если использовать метод iLike
  // то не работают тесты, тк используется sqlite
  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText,
          // [Op.iLike]: `%${searchText}%`,
        },
      },
      order: [
        [`createdAt`, `DESC`],
      ],
    });

    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
