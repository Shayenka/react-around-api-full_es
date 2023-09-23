const bcrypt = require('bcryptjs');
const { generateAuthToken } = require('../utils/utils');
const { User } = require('../models/user');
const { NotFoundError, InvalidError, ServerError } = require('../middlewares/errors');

// Controlador para obtener todas los usuarios
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(ServerError('Ha ocurrido un error en el servidor.'));
  }
};

const getUserId = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).orFail(() => {
      const error = NotFoundError('Usuario no encontrado');
      throw error;
    });

    res.json({ user });
  } catch (error) {
    console.log(error);
    next(ServerError('Ha ocurrido un error en el servidor.'));
  }
};

// Controlador para obtener información sobre el usuario actual
const getUserProfile = (req, res) => {
  const { user } = req;
  res.json({ user });
};

const hashPassword = async (password) => bcrypt.hash(password, 10);

// Controlador para crear un nuevo usuario
const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw InvalidError('Ya Existe un usuario con ese email');
    }

    const passwordHashed = await hashPassword(password);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: passwordHashed,
    });

    res.status(201).json(newUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(InvalidError('Se pasaron datos incorrectos.'));
    } else {
      next(ServerError('Ha ocurrido un error en el servidor.'));
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await User.findUserWithCredentials(email, password);
    console.log(user);
    if (user) {
      const token = await generateAuthToken(user);
      return res.send({ token });
    }
    // return res.status(404).send("Not found");
    throw InvalidCredentialsError('Credenciales de inicio de sesión inválidas');
  } catch (error) {
    console.log(error);
    return res.status(404).send('Not found');
  }
};

// Controlador para actualizar información del perfil de usuario
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    console.log(req.body);
    // Verifica si el usuario autenticado es el propietario del perfil
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true },
    ).orFail();
    return res.status(201).json(updateUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(InvalidError('Datos del perfil inválidos.'));
    } else {
      return res.status(500).json({ message: 'Ha ocurrido un error en el servidor.' });
    }
  }
};

// Controlador para actualizar foto del perfil de usuario
const updateUserAvatarProfile = async (req, res) => {
  try {
    const { avatar } = req.body;
    console.log(req.body);
    const updateUserAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true },
    ).orFail();
    return res.status(201).json(updateUserAvatar);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(ERROR_CODE_INVALID)
        .json({ message: 'Datos de foto de perfil inválidos.' });
    }
    next(ServerError('Ha ocurrido un error en el servidor.'));
  }
};

module.exports = {
  getUsers,
  getUserId,
  getUserProfile,
  createUser,
  login,
  updateUserProfile,
  updateUserAvatarProfile,
};
