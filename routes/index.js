const express = require('express');
const NOT_FOUND_ERROR = require('../errors/notFoundError');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserCreation, validateLogin } = require('../middlewares/validation');

const router = express();

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signup', validateUserCreation, createUser);

router.post('/signin', validateLogin, login);

router.post('/signout', logout);

router.use(auth);

router.use('/', require('./movies'));
router.use('/', require('./users'));

router.use('*', () => {
  throw new NOT_FOUND_ERROR('Запрашиваемая страница не найдена');
});

module.exports = router;
