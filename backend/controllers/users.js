const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  ERROR_CODE_INVALID,
  ERROR_CODE_NOT_FOUND,
} = require('../utils/errorCodes');

// Controlador para obtener todas los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error en el servidor.' });
  }
};

// Controlador para obterner un usuario por su id
const getUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      const error = new Error('Usuario no encontrado');
      error.statusCode = ERROR_CODE_NOT_FOUND;
      throw error;
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido un error en el servidor.' });
  }
};

// Controlador para obtener información sobre el usuario actual
const getUserProfile = (req, res) => {
  const { user } = req;
  res.json({ user });
};

// Controlador para crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const user = await User.findOne({ email });
    let passwordHashed = '';
    if (user) {
      throw new Error('El usuario con ese email ya existe');
    }

    passwordHashed = bcrypt.hash(password);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      passwordHashed,
    });

    res.status(201).json(newUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res
        .status(ERROR_CODE_INVALID)
        .json({ message: 'Datos de usuario inválidos.' });
    } else {
      res.status(500).json({ message: 'Ha ocurrido un error en el servidor.' });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserWithCredentials(email, password);
    let token = '';
    if (user) {
      token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
        expiresIn: '7d',
      });
    }

    res.send({ data: user, token });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(401).json({ message: 'Datos del perfil inválidos.' });
    } else {
      res.status(500).json({ message: 'Ha ocurrido un error en el servidor.' });
    }
  }
};

// Controlador para actualizar información del perfil de usuario
const updateUserProfile = async (req, res) => {
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
      res
        .status(ERROR_CODE_INVALID)
        .json({ message: 'Datos del perfil inválidos.' });
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
      res.status(500).json({ message: 'Ha ocurrido un error en el servidor.' });
    }
  }
};

module.exports = {
  getUsers,
  getUserId,
  getUserProfile,
  createUser,
  login,
  deleteCard,
  updateUserProfile,
  updateUserAvatarProfile,
};
