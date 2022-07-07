'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const readContent = require(`../lib/read-content`);
const generateArticles = require(`../lib/generate-articles`);

const {
  MOCK_FILENAME,
  ExitCode,
} = require(`../../constants`);

const {
  FilePath,
  MockParams,
} = require(`./data`);

module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(FilePath.TITLES);
    const sentences = await readContent(FilePath.SENTENCES);
    const categories = await readContent(FilePath.CATEGORIES);
    const comments = await readContent(FilePath.COMMENTS);

    const [count] = args;
    const articleCount =
      Number.parseInt(count, 10) || MockParams.DEFAULT_COUNT;

    if (articleCount > MockParams.MAX_COUNT) {
      console.error(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.error);
    }

    const content = JSON.stringify(generateArticles(
        articleCount,
        titles,
        categories,
        sentences,
        comments,
    ));

    try {
      await fs.writeFile(MOCK_FILENAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }
  },
};
