const express = require('express');

const router = express.Router();
const cardsController = require('../controllers/card');

const { validateURL } = require('../middlewares/validator');

router.get('/cards', cardsController.getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
  }),
}), cardsController.createCard);

router.delete('/cards/:cardId', cardsController.deleteCard);

router.put('/cards/:cardId/likes', cardsController.likeCard);

router.delete('/cards/:cardId/likes', cardsController.dislikeCard);

module.exports = router;
