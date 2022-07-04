'use strict';

const FilePath = {
  TITLES: `./data/titles.txt`,
  SENTENCES: `./data/sentences.txt`,
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`,
};

const MockParams = {
  DEFAULT_COUNT: 1,
  MAX_COUNT: 1000,
  MAX_SENTENCES_TEXT: 6,
  MONTHS_COUNT: 3,
  MAX_COMMENTS: 4,
  MAX_COMMENT_LENGTH: 3,
};

const CategoryRestrict = {
  MIN: 1,
  MAX: 3,
};

const articlePictures = [
  `forest@1x.jpg`,
  `sea@1x.jpg`,
  `skyscraper@1x.jpg`,
];

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar-1.png`,
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar-2.png`,
  },
  {
    email: `boris@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Борис`,
    lastName: `Джонсон`,
    avatar: `avatar-3.png`,
  },
  {
    email: `markov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Александр`,

    lastName: `Марков`,
    avatar: `avatar-4.png`,
  },
];

module.exports = {
  FilePath,
  MockParams,
  CategoryRestrict,
  articlePictures,
  users,
};

