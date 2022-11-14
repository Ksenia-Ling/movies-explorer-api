const mongoose = require('mongoose');
const validator = require('validator');
const regExForName = require('../utils/regex');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Некорректный формат электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    validator(v) {
      return validator.isStrongPassword(v);
    },
    message: 'Указанный пароль не надёжен',
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(v) {
        return regExForName.test(v);
      },
      message: 'Имя может содержать только латиницу, кириллицу, пробел или дефис',
    },
  },
});

userSchema.methods.toJSON = function deletePassword() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('user', userSchema);
