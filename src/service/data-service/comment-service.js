'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  create(article, comment) {
    const newComment = Object.assign(
        {
          id: nanoid(MAX_ID_LENGTH),
        },
        comment,
    );

    article.comments.push(newComment);
    return newComment;
  }

  drop(article, articleId) {
    const dropComment =
      article.comments.find((item) => item.id === articleId);

    if (!dropComment) {
      return null;
    }

    article.comments =
      article.comments.filter((item) => item.id !== articleId);

    return dropComment;
  }

  findAll(offer) {
    return offer.comments;
  }
}

module.exports = CommentService;
