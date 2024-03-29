'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const readContent = require(`../lib/read-content`);
const generateArticles = require(`../lib/generate-articles`);
const getArticleCount = require(`../lib/get-article-count`);
const {getRandomInt} = require(`../../utils`);

const {
  DATA_DB_FILENAME,
  ExitCode,
} = require(`../../constants`);

const {
  FilePath,
  users,
} = require(`./data`);

const getContent = (
    categories,
    userList,
    articles,
    comments,
    articlesCategories,
) => {
  const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

  const userValues = userList.map(
      ({email, passwordHash, firstName, lastName, avatar}) =>
        `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`,
  ).join(`,\n`);

  const articleValues = articles.map(
      ({title, picture, announce, text, userId}) =>
        `('${title}', '${picture}', '${announce}', '${text}', ${userId})`,
  ).join(`,\n`);

  const commentValues = comments.map(
      ({articleId, userId, text}) =>
        `(${articleId}, ${userId}, '${text}')`,
  ).join(`,\n`);

  const articleCategoryValues = articlesCategories.map(
      ({articleId, categoryId}) =>
        `(${articleId}, ${categoryId})`,
  ).join(`,\n`);

  return `
INSERT INTO categories(name) VALUES
${categoryValues};

INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};

ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, picture, announce, text, user_id) VALUES
${articleValues};
ALTER TABLE articles ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(article_id, user_id, text) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;

ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id) VALUES
${articleCategoryValues};
ALTER TABLE articles_categories ENABLE TRIGGER ALL;`;
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const [count] = args;
    const articleCount = getArticleCount(count);

    const titles = await readContent(FilePath.TITLES);
    const sentences = await readContent(FilePath.SENTENCES);
    const categories = await readContent(FilePath.CATEGORIES);
    const commentList = await readContent(FilePath.COMMENTS);

    const articles = generateArticles(
        articleCount,
        titles,
        categories,
        sentences,
        commentList,
    ).map((article) => ({...article, userId: getRandomInt(1, users.length)}));

    const comments = articles.flatMap(
        (article, index) => article.comments.map((comment) => ({
          ...comment,
          articleId: index + 1,
        })),
    );

    const articlesCategories = articles.flatMap(
        (article, index) => article.categories.map((item) => ({
          articleId: index + 1,
          categoryId: categories.indexOf(item) + 1,
        })),
    );

    const content = getContent(
        categories,
        users,
        articles,
        comments,
        articlesCategories,
    );

    try {
      await fs.writeFile(DATA_DB_FILENAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.success);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }
  },
};
