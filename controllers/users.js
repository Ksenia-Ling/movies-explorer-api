const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const NOT_FOUND_ERROR = require('../errors/notFoundError');
const BAD_REQUEST_ERROR = require('../errors/badRequestError');
const CONFLICT_ERROR = require('../errors/conflictError');
const UNAUTHORIZED_ERROR = require('../errors/unauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const {
  notFoundUser, wrongIdUser, badRequestUser, conflictUser, unauthorisedUser,
} = require('../utils/errorMessages');

// возвращает информацию о пользователе (email и имя)
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR(notFoundUser);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BAD_REQUEST_ERROR(wrongIdUser));
        return;
      }
      next(err);
    });
};

// создаёт пользователя (имя, email, пароль)
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        name,
        email,
        password: hashedPassword,
      })
        .then((user) => res.send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BAD_REQUEST_ERROR(badRequestUser));
            return;
          }
          if (err.name === 'MongoServerError') {
            next(new CONFLICT_ERROR(conflictUser));
            return;
          }
          next(err);
        });
    });
};

// обновляет информацию о пользователе (email и имя)
module.exports.updateProfile = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR(notFoundUser);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST_ERROR(badRequestUser));
        return;
      }
      if (err.name === 'MongoServerError') {
        next(new CONFLICT_ERROR(conflictUser));
        return;
      }
      next(err);
    });
};

// авторизует пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => new UNAUTHORIZED_ERROR(unauthorisedUser))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((isValid) => {
          if (isValid) {
            const token = jwt.sign({
              _id: user._id,
            }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

            res.cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              sameSite: true,
              httpOnly: true,
            });
            res.send({ data: user });
          } else {
            throw new UNAUTHORIZED_ERROR(unauthorisedUser);
          }
        })
        .catch(next);
    })
    .catch(next);
};

// удаляет JWT из куков после выхода
module.exports.logout = (req, res, next) => {
  res.clearCookie('jwt');
  res.send({ message: 'Токен удалён' });
  next();
};
