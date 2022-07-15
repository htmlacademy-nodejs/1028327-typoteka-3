'use strict';

const {Model} = require(`sequelize`);

class ArticleCategory extends Model {}

const define = (sequelize) => ArticleCategory.init({}, {
  sequelize,
  modelName: `ArticleCategory`,
  tableName: `articles_categories`,
  underscored: true,
});

module.exports = define;
