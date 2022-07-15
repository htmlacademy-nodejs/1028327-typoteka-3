'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

const {
  getRandomInt,
  getRandomValue,
  getFormattedDate,
  shuffle,
} = require(`../../utils`);

const {
  MockParams,
  articlePictures,
  CategoryRestrict,
  users,
} = require(`../cli/data`);

const createRandomDate = (monthsCount) => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsCount);

  return new Date(getRandomInt(Date.now(), date.getTime()));
};

const generateComment = (userId, comments) => ({
  userId,
  commentId: nanoid(MAX_ID_LENGTH),
  text: shuffle(comments)
      .slice(0, getRandomInt(1, MockParams.MAX_COMMENT_LENGTH))
      .join(` `),
});

const generateComments = (userCount, comments) =>
  Array(userCount).fill({}).map((_, userIndex) =>
    generateComment(userIndex + 1, comments));

const generateArticle = (titles, categoryList, sentences, commentList) => {
  const articleId = nanoid(MAX_ID_LENGTH);
  const title = getRandomValue(titles);
  const createdDate =
    getFormattedDate(createRandomDate(MockParams.MONTHS_COUNT));
  const announce = getRandomValue(sentences);
  const text = shuffle(sentences)
      .slice(0, MockParams.MAX_SENTENCES_TEXT)
      .join(` `);
  const categoryCount = getRandomInt(CategoryRestrict.MIN, CategoryRestrict.MAX);
  const categories = shuffle(categoryList).slice(0, categoryCount);
  const comments = shuffle(generateComments(users.length, commentList));
  const picture = getRandomValue(articlePictures);

  return {
    articleId,
    title,
    createdDate,
    announce,
    text,
    categories,
    comments,
    picture,
  };
};

const generateArticles = (
    count,
    titles,
    categories,
    sentences,
    comments,
) => Array(count).fill({})
  .map(() => generateArticle(titles, categories, sentences, comments));

module.exports = generateArticles;
