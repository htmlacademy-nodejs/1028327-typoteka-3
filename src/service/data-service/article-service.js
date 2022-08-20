'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id},
    });

    return !!deletedRows;
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(
        article,
        {where: {id}},
    );

    return !!affectedRows;
  }

  async findAll() {
    const articles = await this._Article.findAll({
      attributes: {
        include: [[
          Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)),
          `commentsCount`,
        ]],
      },
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
          attributes: [],
        },
      ],
      order: [[`createdAt`, `DESC`]],
      group: [
        `Article.id`,
        `categories.id`,
        `categories->ArticleCategory.created_at`,
        `categories->ArticleCategory.updated_at`,
        `categories->ArticleCategory.article_id`,
        `categories->ArticleCategory.category_id`,
      ],
    });

    return articles.map((article) => article.get());
  }

  async findDiscussed(limit) {
    return await this._Article.findAll({
      attributes: [
        `announce`,
        `id`,
        [
          Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)),
          `comments`,
        ],
      ],
      include: [
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          attributes: [],
        },
      ],
      having: Sequelize.where(
          Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)),
          {
            [Sequelize.Op.gt]: 0,
          },
      ),
      order: [
        [Sequelize.literal(`comments`), `DESC`],
        [`createdAt`, `DESC`],
      ],
      group: [
        `Article.id`,
      ],
      limit,
      subQuery: false,
      raw: true,
    });
  }

  async findOne(id, needComments) {
    const include = [{
      model: this._Category,
      as: Aliase.CATEGORIES,
      attributes: [
        `id`,
        `name`,
      ],
    }];

    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        attributes: [
          `id`,
          `text`,
          `createdAt`,
        ],
        include: [
          {
            model: this._User,
            as: Aliase.USER,
            attributes: [
              `name`,
              `avatar`,
            ],
          },
        ],
      });
    }

    return this._Article.findByPk(id, {
      include,
      attributes: {
        exclude: [
          `createdAt`,
          `updatedAt`,
        ],
      },
    });
  }

  async findPage({limit, offset}) {
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
      distinct: true,
    });

    return {count, articles: rows};
  }
}

module.exports = ArticleService;
