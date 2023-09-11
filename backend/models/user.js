const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Email incorrecto',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorador',
  },
  avatar: {
    type: String,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: 'El enlace del avatar no cumple con los requisitos.',
    },
    default: 'enlace',
  },
});

userSchema.statics.findUserWithCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('El usuario no existe');
  }

  const comparedPasswords = await bcrypt.compare(password, user.password);

  if (!comparedPasswords) {
    throw new Error('El password es incorrecto');
  }

  return user;
};

module.exports = mongoose.model('user', userSchema);
