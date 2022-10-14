const NOT_FOUND_ERROR = require('../errors/notFoundError');
const BAD_REQUEST_ERROR = require('../errors/badRequestError');
const FORBIDDEN_ERROR = require('../errors/forbidenError');

const Movie = require('../models/movie');

// возвращает все сохранённые текущим  пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
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
        next(new BAD_REQUEST_ERROR('Некорректные данные фильма'));
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
        throw new NOT_FOUND_ERROR('Запрашиваемый фильм не найден');
      }
      if (movie.owner.toString() !== owner) {
        throw new FORBIDDEN_ERROR('Удалять фильмы может только их владелец');
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((removedMovie) => {
            res.send(removedMovie);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BAD_REQUEST_ERROR('Некорректный id'));
        return;
      }
      next(err);
    });
};
