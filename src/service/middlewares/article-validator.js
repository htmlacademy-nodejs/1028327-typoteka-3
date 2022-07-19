'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorOfferMessage = {
  CATEGORIES_TYPE: `Произошла ошибка при выборе категории объявления`,
  CATEGORIES_MIN: `Не выбрана ни одна категория объявления`,
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  ANNOUNCE_MIN: `Анонс содержит меньше 30 символов`,
  ANNOUNCE_MAX: `Анонс не может содержать более 250 символов`,
  TEXT_MAX: `Текст публикации не может содержать более 1000 символов`,
};

const schema = Joi.object({
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorOfferMessage.CATEGORIES_TYPE,
      }),
  ).min(1).required().messages({
    'array.min': ErrorOfferMessage.CATEGORIES_MIN,
  }),
  title: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorOfferMessage.TITLE_MIN,
    'string.max': ErrorOfferMessage.TITLE_MAX,
  }),
  announce: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorOfferMessage.ANNOUNCE_MIN,
    'string.max': ErrorOfferMessage.ANNOUNCE_MAX,
  }),
  text: Joi.string().max(1000).empty(``).messages({
    'string.max': ErrorOfferMessage.TEXT_MAX,
  }),
  picture: Joi.string().empty(``),
});

module.exports = (req, res, next) => {
  const article = req.body;

  const {error} = schema.validate(article, {abortEarly: false});

  if (error) {
    res.status(HttpCode.BAD_REQUEST).send(
        error.details.map((err) => err.message).join(`\n`),
    );
    return;
  }

  next();
};
