const jwt = require('jsonwebtoken');
const UNAUTHORIZED_ERROR = require('../errors/unauthorizedError');
const { unauthorisedError } = require('../utils/errorMessages');

const { NODE_ENV, JWT_SECRET } = process.env;
const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UNAUTHORIZED_ERROR(unauthorisedError));
    return;
  }

  req.user = payload;
  next();
};

module.exports = auth;
