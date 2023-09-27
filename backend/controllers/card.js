const Card = require('../models/card');
const {
  NotFoundError, InvalidError, NotAuthorization, ServerError,
} = require('../middlewares/errors');

// Controlador para obtener todas las tarjetas
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    next(ServerError('Ha ocurrido un error en el servidor.'));
  }
};

// Controlador para crear una nueva tarjeta
const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    console.log(req.body);
    console.log(req.user);
    const ownerId = req.user._id;
    const newCard = await Card.create({ name, link, owner: ownerId });
    res.status(201).json(newCard);
  } catch (error) {
    console.log(error);
    if (error.name === 'ValidationError') {
      next(InvalidError('Datos de la tarjeta inválidos.'));
    } else {
      next(ServerError('Ha ocurrido un error en el servidor.'));
    }
  }
};

// Controlador para eliminar una tarjeta por su _id
const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { _id } = req.user;
    const selectedCard = await Card.findById(cardId);
    console.log(selectedCard);

    if (!selectedCard) {
      throw new NotFoundError('No se encontró la tarjeta con esa ID.');
    }

    if (String(selectedCard.owner) !== _id) {
      throw new NotAuthorization('No tienes permiso para borrar esta tarjeta.');
    }

    const deletedCard = await Card.findByIdAndRemove(cardId);
    res.json({ data: deletedCard });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(InvalidError('Se pasaron datos inválidos.'));
    }
    next(ServerError('Ha ocurrido un error en el servidor.'));
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
    console.log(addlike);
  } catch (error) {
    console.log(error);
    next(InvalidError('Error al dar like a la tarjeta.'));
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
    console.log(dislike);
  } catch (error) {
    next(InvalidError('Error al quitar like a la tarjeta.'));
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
