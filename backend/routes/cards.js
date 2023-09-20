const express = require('express');

const router = express.Router();
const { celebrate, Joi } = require('celebrate');
const cardsController = require('../controllers/card');
const { jwtMiddleware } = require('../middlewares/auth');

const { validateURL } = require('../middlewares/validator');

router.get('/cards', jwtMiddleware, cardsController.getCards);

router.post('/cards', jwtMiddleware, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
  }),
}), cardsController.createCard);

router.delete('/cards/:cardId', jwtMiddleware, cardsController.deleteCard);

router.put('/cards/:cardId/likes', jwtMiddleware, cardsController.likeCard);

router.delete('/cards/:cardId/likes', jwtMiddleware, cardsController.dislikeCard);

module.exports = router;
