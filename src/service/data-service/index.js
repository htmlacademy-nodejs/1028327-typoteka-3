'use strict';

const CategoryService = require(`./category-service`);
const SearchService = require(`./search-service`);
const ArticleService = require(`./article-service`);
const CommentService = require(`./comment-service`);
const UserService = require(`./user`);

module.exports = {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
  UserService,
};
