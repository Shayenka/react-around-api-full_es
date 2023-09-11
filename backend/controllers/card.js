const Card = require('../models/card');
const { NotFoundError, InvalidError, NotAuthorization, ServerError } = require('../middlewares/errors');

// Controlador para obtener todas las tarjetas
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    next(new ServerError('Ha ocurrido un error en el servidor.'));
  }
};

// Controlador para crear una nueva tarjeta
const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const newCard = await Card.create({ name, link, owner: ownerId });
    res.status(201).json(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new InvalidError('Datos de la tarjeta inválidos.'));
    } else {
      next(new ServerError('Ha ocurrido un error en el servidor.'));
    }
  }
};

// Controlador para eliminar una tarjeta por su _id
const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { userId } = req.user;
    const selectedCard = await Card.findById(cardId);

    if (!selectedCard) {
      throw new NotFoundError('No se encontró la tarjeta con esa ID.');
    }

    if (selectedCard.owner._id !== userId) {
      throw new NotAuthorization('No tienes permiso para borrar esta tarjeta.');
    }

    const deletedCard = await Card.findByIdAndRemove(cardId);
    res.json({ data: deletedCard });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new InvalidError('Se pasaron datos inválidos.'));
    }
    next(new ServerError('Ha ocurrido un error en el servidor.'));
  }
};

// Controlador para dar like a una tajeta
const likeCard = async (req, res, next) => {
  try {
    const addlike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail();
    res.status(200).json(addlike);
  } catch (error) {
    next(new InvalidError('Error al dar like a la tarjeta.'));
  }
};

// Controlador para quitar like de una tajeta
const dislikeCard = async (req, res, next) => {
  try {
    const dislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail();
    res.status(200).json(dislike);
  } catch (error) {
    next(new InvalidError('Error al quitar like a la tarjeta.'));
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
