'use strict';

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineArticleCategory = require(`./article-category`);
const Aliase = require(`./aliase`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
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
  });

  Category.hasMany(ArticleCategory, {
    as: Aliase.ARTICLES_CATEGORIES,
  });

  return {Category, Comment, Article, ArticleCategory};
};

module.exports = define;
