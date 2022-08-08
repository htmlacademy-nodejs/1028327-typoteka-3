'use strict';

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);
const defineArticleCategory = require(`./article-category`);
const Aliase = require(`./aliase`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);
  const ArticleCategory = defineArticleCategory(sequelize);

  Article.hasMany(Comment, {
    as: Aliase.COMMENTS,
    onDelete: `cascade`,
  });

  Comment.belongsTo(Article);

  Article.belongsToMany(Category, {
    as: Aliase.CATEGORIES,
    through: ArticleCategory,
  });

  Category.belongsToMany(Article, {
    as: Aliase.ARTICLES,
    through: ArticleCategory,
    onDelete: `RESTRICT`,
  });

  Category.hasMany(ArticleCategory, {
    as: Aliase.ARTICLES_CATEGORIES,
  });

  User.hasMany(Article, {
    as: Aliase.ARTICLES,
    foreignKey: `userId`,
  });

  Article.belongsTo(User, {
    as: Aliase.USER,
    foreignKey: `userId`,
  });

  User.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `userId`,
  });

  Comment.belongsTo(User, {
    as: Aliase.USER,
    foreignKey: `userId`,
  });

  return {
    Category,
    Comment,
    Article,
    ArticleCategory,
    User,
  };
};

module.exports = define;
