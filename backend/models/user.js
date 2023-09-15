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
      message: (props) => `${props.value} no es un email valido`,
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
    default: 'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
  },
});

userSchema.statics.findUserWithCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select('+password');

  if (!user) {
    return new Error('Usuario no encontrado');
  }

  const comparedPasswords = await bcrypt.compare(password, user.password);

  if (!comparedPasswords) {
    return new Error('Contraseña incorrecta');
  }

  return user;
};

const User = mongoose.model('user', userSchema);

export default User;
