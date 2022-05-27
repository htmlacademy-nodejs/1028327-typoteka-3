'use strict';

const {HttpCode} = require(`../../constants`);

const articleKeys = [
  `title`,
  `createdDate`,
  `сategory`,
  `announce`,
  `fullText`,
  `comments`,
];


module.exports = (req, res, next) => {
  const article = req.body;
  const keys = Object.keys(article);
  const keysExists = articleKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST).send(`Bad article request`);
  }

  next();
};
