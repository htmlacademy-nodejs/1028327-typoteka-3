'use strict';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.getRandomInt = getRandomInt;

module.exports.getRandomValue = (array) =>
  array[getRandomInt(0, array.length - 1)];

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] =
      [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

/**
 * @param {Date} date
 * @return {string} // 2019-12-01 14:45:00
 */
module.exports.getFormattedDate = (date) =>
  date.toISOString().replace(/T/, ` `).replace(/\.[\s\S]*/g, ``);

module.exports.ensureArray = (value) => Array.isArray(value) ? value : [value];

module.exports.prepareErrors = (errors) => errors.response
  ? errors.response.data.split(`\n`)
  : [`Неизвестная ошибка`];

module.exports.cropStr = (str, maxletters) =>
  str.length > maxletters ? `${str.slice(0, maxletters)}...` : str;
