const bcrypt = require('bcryptjs');
const generateAuthToken = require('../utils/utils');
const User = require('../models/user');
const { NotFoundError, InvalidError, ServerError } = require('../middlewares/errors');

// Controlador para obtener todas los usuarios
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(new ServerError('Ha ocurrido un error en el servidor.'));
  }
};

const getUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      const error = new NotFoundError('Usuario no encontrado');
      throw error;
    });

    res.json({ user });
  } catch (error) {
    next(new ServerError('Ha ocurrido un error en el servidor.'));
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
      throw new InvalidError('Ya Existe un usuario con ese email');
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
      next(new InvalidError('Se pasaron datos incorrectos.'));
    } else {
      next(new ServerError('Ha ocurrido un error en el servidor.'));
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserWithCredentials(email, password);

    if (user) {
      const token = await generateAuthToken();
      return res.send({ token });
    }
    throw new InvalidCredentialsError('Credenciales de inicio de sesión inválidas');
  } catch (error) {
    next(error);
  }
};

// Controlador para actualizar información del perfil de usuario
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;

    // Verifica si el usuario autenticado es el propietario del perfil
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ message: 'No tienes permiso para editar este perfil.' });
    }
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true },
    ).orFail();
    res.status(201).json(updateUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new InvalidError('Datos del perfil inválidos.'));
    } else {
      res.status(500).json({ message: 'Ha ocurrido un error en el servidor.' });
    }
  }
};

// Controlador para actualizar foto del perfil de usuario
const updateUserAvatarProfile = async (req, res) => {
  try {
    const { avatar } = req.body;
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ message: 'No tienes permiso para editar este perfil.' });
    }
    const updateUserAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true },
    ).orFail();
    res.status(201).json(updateUserAvatar);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res
        .status(ERROR_CODE_INVALID)
        .json({ message: 'Datos de foto de perfil inválidos.' });
    } else {
      next(new ServerError('Ha ocurrido un error en el servidor.'));
    }
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
