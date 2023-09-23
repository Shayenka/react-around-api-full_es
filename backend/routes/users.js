const express = require('express');

const router = express.Router();
const { celebrate, Joi } = require('celebrate');
const usersController = require('../controllers/users');
const { jwtMiddleware } = require('../middlewares/auth');
const { validateURL } = require('../middlewares/validator');

router.get('/users', jwtMiddleware, usersController.getUsers);
router.get('/users/:userId', jwtMiddleware, usersController.getUserId);
router.get('/users/me', jwtMiddleware, usersController.getUserProfile);
router.post('/users', jwtMiddleware, usersController.createUser);

router.patch('/users/me', jwtMiddleware, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), usersController.updateUserProfile);

router.patch('/users/me/avatar', jwtMiddleware, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  }),
}), usersController.updateUserAvatarProfile);

module.exports = router;
