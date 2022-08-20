'use strict';

const {cropStr} = require(`../../utils`);
const {MAX_LETTERS_PROMO_TEXT} = require(`../../constants`);

const adaptToClient = (articles, comments) => {
  const adaptedArticles = articles.map((article) => ({
    ...article,
    announce: cropStr(article.announce, MAX_LETTERS_PROMO_TEXT),
  }));

  const adaptedComments = comments.map((comment) => ({
    ...comment,
    text: cropStr(comment.text, MAX_LETTERS_PROMO_TEXT),
  }));

  return [adaptedArticles, adaptedComments];
};

module.exports = {
  adaptToClient,
};
