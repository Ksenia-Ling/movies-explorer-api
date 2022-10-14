const { celebrate, Joi } = require('celebrate');
const regExForUrl = require('../utils/regex');

module.exports.validateUserCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validateUserUpdating = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports.validateMovieCreation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regExForUrl),
    trailerLink: Joi.string().required().regex(regExForUrl),
    thumbnail: Joi.string().required().regex(regExForUrl),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
});

module.exports.validateMovieDeletion = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});
