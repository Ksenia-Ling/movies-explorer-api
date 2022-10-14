const mongoose = require('mongoose');
const regExForUrl = require('../utils/regex');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return regExForUrl.test(v);
      },
      message: 'Некорректный url-адрес',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return regExForUrl.test(v);
      },
      message: 'Некорректный url-адрес',
    },
  },
  thumbnail: {
    // миниатюрное изображение постера к фильму.
    type: String,
    required: true,
    validate: {
      validator(v) {
        return regExForUrl.test(v);
      },
      message: 'Некорректный url-адрес',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    // id фильма, который содержится в ответе сервиса MoviesExplorer.
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
