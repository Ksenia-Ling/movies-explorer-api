const express = require('express');

const movieRoutes = express.Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { validateMovieCreation, validateMovieDeletion } = require('../middlewares/validation');

movieRoutes.get('/movies', getMovies);

movieRoutes.post('/movies', validateMovieCreation, createMovie);

movieRoutes.delete('/movies/:movieId', validateMovieDeletion, deleteMovie);

module.exports = movieRoutes;
