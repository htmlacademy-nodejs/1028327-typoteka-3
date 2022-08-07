'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorOfferMessage = {
  NAME_MIN: `Название категории содержит меньше 5 символов`,
  NAME_MAX: `Название категории не может содержать более 30 символов`,
};

const schema = Joi.object({
  name: Joi.string().min(5).max(30).required().messages({
    'string.min': ErrorOfferMessage.NAME_MIN,
    'string.max': ErrorOfferMessage.NAME_MAX,
  }),
});

module.exports = (req, res, next) => {
  const category = req.body;

  const {error} = schema.validate(category, {
    abortEarly: false,
  });

  if (error) {
    res.status(HttpCode.BAD_REQUEST).send(
        error.details.map((err) => err.message).join(`\n`),
    );
    return;
  }

  next();
};
