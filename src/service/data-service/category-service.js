'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(needCount) {
    if (needCount) {
      const categories = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(`COUNT`, `categories.id`),
            `count`,
          ],
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLES_CATEGORIES,
          attributes: [],
        }],
      });
      return categories.map((category) => category.get());
    } else {
      return await this._Category.findAll({raw: true});
    }
  }
}

module.exports = CategoryService;
