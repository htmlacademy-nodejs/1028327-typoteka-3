'use strict';

const fs = require(`fs`);
const {ExitCode} = require(`../../constants`);
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
const FILE_NAME = `mocks.json`;

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`,
];

const SENTENCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];

const createRandomDate = (monthsCount) => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsCount);

  return new Date(getRandomInt(Date.now(), date.getTime()));
};

const generatePublication = () => {
  const title = TITLES[getRandomInt(0, TITLES.length - 1)];
  const createdDate = getFormattedDate(createRandomDate(MONTHS_COUNT));
  const sentencesInAnnounce = getRandomInt(1, MAX_SENTENCES_IN_ANNOUNCE);
  const sentencesInFullText = getRandomInt(MAX_SENTENCES_IN_ANNOUNCE, MAX_SENTENCES_IN_FULL_TEXT);
  const announce = shuffle(SENTENCES).slice(1, sentencesInAnnounce).join(` `);
  const fullText = shuffle(SENTENCES).slice(MAX_SENTENCES_IN_ANNOUNCE, sentencesInFullText).join(` `);
  const сategory = shuffle(CATEGORIES).slice(1, MAX_CATEGORIES);

  return {
    title,
    createdDate,
    announce,
    fullText,
    сategory,
  };
};

const generatePublications = (count) => Array(count).fill({}).map(generatePublication);

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const countPublication = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countPublication > MAX_COUNT) {
      console.error(`Не больше 1000 публикаций`);
      process.exit(ExitCode.error);
    }

    const content = JSON.stringify(generatePublications(countPublication));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        console.error(`Can't write data to file...`);
        process.exit(ExitCode.error);
      }

      return console.info(`Operation success. File created.`);
    });
  }
};
