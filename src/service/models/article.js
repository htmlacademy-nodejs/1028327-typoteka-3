'use strict';

const MAX_LETTERS_ANNOUNCE = 250;
const MAX_LETTERS_TEXT = 1000;

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  picture: DataTypes.STRING,
  announce: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(MAX_LETTERS_ANNOUNCE),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  text: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(MAX_LETTERS_TEXT),
  },
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`,
  underscored: true,
});

module.exports = define;
