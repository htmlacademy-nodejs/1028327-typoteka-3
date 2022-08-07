'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async create(categoryData) {
    const category = await this._Category.create(categoryData);

    return category.get();
  }

  async update(id, article) {
    const [affectedRows] = await this._Category.update(
        article,
        {where: {id}},
    );

    return !!affectedRows;
  }

  async drop(id) {
    const deletedRows = await this._Category.destroy({
      where: {id},
    });

    return !!deletedRows;
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
      return await this._Category.findAll({
        raw: true,
        attributes: [
          `id`,
          `name`,
        ],
      });
    }
  }

  async findOne(categoryId) {
    return this._Category.findByPk(categoryId, {
      attributes: [
        `id`,
        `name`,
      ],
    });
  }

  async findPage({categoryId, limit, offset}) {
    const articlesIdByCategory = await this._ArticleCategory.findAll({
      attributes: [`ArticleId`],
      where: {
        CategoryId: categoryId,
      },
      raw: true,
    });

    const articlesId = articlesIdByCategory.map((articleIdItem) => articleIdItem.ArticleId);

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: this._Category,
          as: Aliase.CATEGORIES,
          attributes: [
            `id`,
            `name`,
          ],
        },
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          attributes: [
            `id`,
            `text`,
          ],
        },
      ],
      order: [
        [`createdAt`, `DESC`],
      ],
      where: {
        id: articlesId,
      },
      distinct: true,
    });

    return {count, articlesByCategory: rows};
  }
}

module.exports = CategoryService;
