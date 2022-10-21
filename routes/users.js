const express = require('express');

const userRoutes = express.Router();

const {
  getUser,
  updateProfile,
} = require('../controllers/users');

const { validateUserUpdating } = require('../middlewares/validation');

userRoutes.get('/users/me', getUser);

userRoutes.patch('/users/me', validateUserUpdating, updateProfile);

module.exports = userRoutes;
