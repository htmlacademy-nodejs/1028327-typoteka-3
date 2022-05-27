'use strict';

const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const fs = require(`fs`).promises;

const {
  MOCK_FILENAME,
  MAX_ID_LENGTH,
  ExitCode,
} = require(`../../constants`);

const {
  getRandomInt,
  getFormattedDate,
  shuffle,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const MAX_SENTENCES_IN_ANNOUNCE = 5;
const MAX_SENTENCES_IN_FULL_TEXT = 12;
const MAX_CATEGORIES = 3;
const MONTHS_COUNT = 3;
const MAX_COMMENTS = 4;
const MAX_COMMENT_LENGTH = 3;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComment = (comments) => ({
  id: nanoid(MAX_ID_LENGTH),
  text: shuffle(comments)
      .slice(0, getRandomInt(1, MAX_COMMENT_LENGTH))
      .join(` `),
});

const generateComments = (count, comments) =>
  Array(count).fill({}).map(() => generateComment(comments));

const createRandomDate = (monthsCount) => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsCount);

  return new Date(getRandomInt(Date.now(), date.getTime()));
};

const generatePublication = (titles, categories, sentences, commentsList) => {
  const id = nanoid(MAX_ID_LENGTH);
  const title = titles[getRandomInt(0, titles.length - 1)];
  const createdDate = getFormattedDate(createRandomDate(MONTHS_COUNT));
  const sentencesInAnnounce = getRandomInt(1, MAX_SENTENCES_IN_ANNOUNCE);
  const sentencesInFullText =
    getRandomInt(MAX_SENTENCES_IN_ANNOUNCE + 1, MAX_SENTENCES_IN_FULL_TEXT);
  const announce = shuffle(sentences).slice(0, sentencesInAnnounce).join(` `);
  const fullText = shuffle(sentences)
    .slice(sentencesInAnnounce, sentencesInFullText)
    .join(` `);
  const сategory = shuffle(categories).slice(0, MAX_CATEGORIES);
  const commentsCount = getRandomInt(0, MAX_COMMENTS);
  const comments = generateComments(commentsCount, commentsList);

  return {
    id,
    title,
    createdDate,
    announce,
    fullText,
    сategory,
    comments,
  };
};

const generatePublications = (
    count,
    titles,
    categories,
    sentences,
    comments
) => Array(count).fill({})
  .map(() => generatePublication(titles, categories, sentences, comments));

module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countPublication = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countPublication > MAX_COUNT) {
      console.error(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.error);
    }

    const content = JSON.stringify(generatePublications(
        countPublication,
        titles,
        categories,
        sentences,
        comments
    ));

    try {
      await fs.writeFile(MOCK_FILENAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }
  }
};
