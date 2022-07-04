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
  id: nanoid(MAX_ID_LENGTH),
  text: shuffle(comments)
      .slice(0, getRandomInt(1, MockParams.MAX_COMMENT_LENGTH))
      .join(` `),
});

const generateComments = (userCount, comments) =>
  Array(userCount).fill({}).map((_, userIndex) =>
    generateComment(userIndex + 1, comments));

const generatePublication = (titles, categories, sentences, commentsList) => {
  const id = nanoid(MAX_ID_LENGTH);
  const title = getRandomValue(titles);
  const createdDate =
    getFormattedDate(createRandomDate(MockParams.MONTHS_COUNT));
  const announce = getRandomValue(sentences);
  const fullText = shuffle(sentences)
      .slice(0, MockParams.MAX_SENTENCES_TEXT)
      .join(` `);
  const categoryCount = getRandomInt(CategoryRestrict.MIN, CategoryRestrict.MAX);
  const category = shuffle(categories).slice(0, categoryCount);
  const comments = shuffle(generateComments(users.length, commentsList));
  const picture = getRandomValue(articlePictures);

  return {
    id,
    title,
    createdDate,
    announce,
    fullText,
    category,
    comments,
    picture,
  };
};

const generatePublications = (
    count,
    titles,
    categories,
    sentences,
    comments,
) => Array(count).fill({})
  .map(() => generatePublication(titles, categories, sentences, comments));

module.exports = generatePublications;
