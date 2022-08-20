'use strict';

/* global document, io */

(() => {
  const SERVER_URL = `http://localhost:3000`;

  const socket = io(SERVER_URL);

  const createMostDiscussedElement = (article) => {
    const template = document.querySelector(`#most-discussed-template`);
    const element = template.cloneNode(true).content;

    element.querySelector(`.hot__list-link`).href = `/articles/${article.id}#comments`;
    element.querySelector(`.hot__list-link span`).textContent = article.announce;
    element.querySelector(`.hot__link-sup`).textContent = article.comments;

    return element;
  };

  const createLastCommentElement = (comment) => {
    const template = document.querySelector(`#last-comment-template`);
    const element = template.cloneNode(true).content;

    element.querySelector(`.last__list-image`).src = `/img/${comment.user.avatar}`;
    element.querySelector(`.last__list-name`).textContent = comment.user.name;
    element.querySelector(`.last__list-link`).href = `/articles/${comment.articleId}#comment-${comment.id}`;
    element.querySelector(`.last__list-link`).textContent = comment.text;

    return element;
  };

  const updateMostDiscussed = (mainPromoBlock, mostDiscussed) => {
    const listBlock = mainPromoBlock.querySelector(`.hot__list`);
    listBlock.innerHTML = ``;

    mostDiscussed.forEach((article) => {
      listBlock.append(createMostDiscussedElement(article));
    });
  };

  const updateLastComments = (mainPromoBlock, lastestComments) => {
    const listBlock = mainPromoBlock.querySelector(`.last__list`);
    listBlock.innerHTML = ``;

    lastestComments.forEach((comment) => {
      listBlock.append(createLastCommentElement(comment));
    });
  };

  const upadatePromoBlock = (data) => {
    console.log(data);

    const mainPromoBlock = document.querySelector(`.main-page__section-flex`);
    if (!mainPromoBlock) {
      return;
    }

    updateLastComments(mainPromoBlock, data.lastestComments);
    updateMostDiscussed(mainPromoBlock, data.mostDiscussed);
  };

  socket.addEventListener(`comment:create`, (data) => {
    upadatePromoBlock(data);
  });
})();

