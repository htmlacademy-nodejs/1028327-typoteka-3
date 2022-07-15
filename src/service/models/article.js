'use strict';

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
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  text: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(1000),
  },
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`,
  underscored: true,
});

module.exports = define;
