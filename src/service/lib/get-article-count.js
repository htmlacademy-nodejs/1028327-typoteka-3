'use strict';

const chalk = require(`chalk`);
const {ExitCode} = require(`../../constants`);
const {MockParams} = require(`../cli/data`);

module.exports = (count) => {
  const articleCount = isNaN(Number.parseInt(count, 10))
    ? MockParams.DEFAULT_COUNT
    : Number.parseInt(count, 10);

  if (articleCount > MockParams.MAX_COUNT) {
    console.error(chalk.red(`Не больше ${MockParams.MAX_COUNT} публикаций`));
    process.exit(ExitCode.error);
  }

  return articleCount;
};

