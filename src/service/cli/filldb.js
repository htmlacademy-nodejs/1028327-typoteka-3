'use strict';

const {getLogger} = require(`../lib/logger`);
const readContent = require(`../lib/read-content`);
const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);
const generateArticles = require(`../lib/generate-articles`);
const passwordUtils = require(`../lib/password`);
const {ExitCode} = require(`../../constants`);
const {getRandomValue} = require(`../../utils`);

const {
  FilePath,
  MockParams,
} = require(`./data`);

const logger = getLogger({});

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.error);
    }
    await logger.info(`Connection to database established`);

    const titles = await readContent(FilePath.TITLES);
    const sentences = await readContent(FilePath.SENTENCES);
    const categories = await readContent(FilePath.CATEGORIES);
    const comments = await readContent(FilePath.COMMENTS);

    const users = [
      {
        name: `Иван Иванов`,
        email: `ivanov@example.com`,
        passwordHash: await passwordUtils.hash(`ivanov`),
        avatar: `avatar-1.png`,
      },
      {
        name: `Пётр Петров`,
        email: `petrov@example.com`,
        passwordHash: await passwordUtils.hash(`petrov`),
        avatar: `avatar-2.png`,
      },
      {
        name: `Зураби Беридзе`,
        email: `beridze@example.com`,
        passwordHash: await passwordUtils.hash(`beridze`),
        avatar: `avatar-3.png`,
      },
      {
        name: `Ганс Мюллер`,
        email: `gans@example.com`,
        passwordHash: await passwordUtils.hash(`gans`),
        avatar: `avatar-4.png`,
      },
    ];

    const [count] = args;
    const articleCount =
      Number.parseInt(count, 10) || MockParams.DEFAULT_COUNT;

    if (articleCount > MockParams.MAX_COUNT) {
      logger.error(`Не больше 1000 публикаций`);
      process.exit(ExitCode.error);
    }

    const articles = generateArticles(
        articleCount,
        titles,
        categories,
        sentences,
        comments,
    ).map((article) => ({
      ...article,
      user: getRandomValue(users).email,
      comments: article.comments.map((comment) => ({
        ...comment,
        user: getRandomValue(users).email,
      })),
    }));

    await initDatabase(sequelize, {articles, categories, users});
    sequelize.close();
  },
};
