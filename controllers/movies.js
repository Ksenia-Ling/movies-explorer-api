const NOT_FOUND_ERROR = require('../errors/notFoundError');
const BAD_REQUEST_ERROR = require('../errors/badRequestError');
const FORBIDDEN_ERROR = require('../errors/forbidenError');

const Movie = require('../models/movie');
const {
  badRequestMovie, notFoundMovie, notOwnerMovie, wrongIdMovie,
} = require('../utils/errorMessages');

// возвращает все сохранённые текущим  пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

// создаёт фильм с переданными в теле атрибутами
module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.create({
    ...req.body, owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST_ERROR(badRequestMovie));
        return;
      }
      next(err);
    });
};

// удаляет сохранённый фильм по id
module.exports.deleteMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NOT_FOUND_ERROR(notFoundMovie);
      }
      if (movie.owner.toString() !== owner) {
        throw new FORBIDDEN_ERROR(notOwnerMovie);
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((removedMovie) => {
            res.send(removedMovie);
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BAD_REQUEST_ERROR(wrongIdMovie));
        return;
      }
      next(err);
    });
};
