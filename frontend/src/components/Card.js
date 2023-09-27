import React, { useContext } from "react";
import deleteCard from "../images/Papelera.svg";
import likeCard from "../images/like.svg";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Card(props) {
  const currentUser = useContext(CurrentUserContext);

  const isOwn = props.owner === currentUser._id;

  const cardDeleteButtonClassName = `element__delete ${
    isOwn ? "element__delete-visible" : ""
  }`;

  const isLiked = props.likes.some((item) => item === currentUser._id);

  const cardLikeButtonClassName = `icon-like ${
    isLiked ? "icon-like_black" : ""
  }`;

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }
  return (
    <div className="element" key={props.card._id}>
      <img
        className={cardDeleteButtonClassName}
        src={deleteCard}
        alt="Icono de papelera para eliminar"
        onClick={handleDeleteClick}
      />
      <img
        className="element__image"
        src={props.link}
        alt={props.name}
        style={{ backgroundImage: `url(${props.link})` }}
        onClick={handleClick}
      />
      <div className="element__footer-photo">
        <h3 className="element__title">{props.name}</h3>
        <div className="likes-card">
          <img
            className={cardLikeButtonClassName}
            src={likeCard}
            alt="Icono de corazón"
            onClick={handleLikeClick}
          />
          <span className="likes-card__count">{props.likes.length}</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
