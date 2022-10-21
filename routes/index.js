const express = require('express');
const NOT_FOUND_ERROR = require('../errors/notFoundError');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserCreation, validateLogin } = require('../middlewares/validation');
const { notFoundPage, crashServer } = require('../utils/errorMessages');

const router = express();

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(crashServer);
  }, 0);
});

router.post('/signup', validateUserCreation, createUser);

router.post('/signin', validateLogin, login);

router.use(auth);

router.post('/signout', logout);

router.use('/', require('./movies'));
router.use('/', require('./users'));

router.use('*', () => {
  throw new NOT_FOUND_ERROR(notFoundPage);
});

module.exports = router;
