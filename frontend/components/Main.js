import React, { useContext } from "react";
import editprofile from "../images/Edit.svg";
import addcard from "../images/Signo+.svg";
import Card from "./Card.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Main(props) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile">
        <div
          className="profile__avatar"
          onClick={() => {
            props.onEditAvatarClick();
          }}
        >
          <img
            className="profile__image"
            src={currentUser.avatar}
            alt="Foto de Perfil"
            style={{ backgroundImage: `url(${currentUser.avatar})` }}
          />
        </div>

        <div className="profile__info">
          <div>
            <h1 className="profile__name">{currentUser.name}</h1>
            <h2 className="profile__occupation">{currentUser.about}</h2>
          </div>
          <button
            className="profile__edit"
            onClick={() => {
              props.onEditProfileClick();
            }}
          >
            <img
              className="profile__icon"
              src={editprofile}
              alt="icono de lápiz para editar perfil."
            />
          </button>
        </div>
        <button
          className="add-button"
          id="addButton"
          onClick={() => {
            props.onAddPlaceClick();
          }}
        >
          <img
            className="add-button__icon"
            src={addcard}
            alt="Icono del signo + para añadir card."
          />
        </button>
      </section>

      <section className="elements">
        {props.cards.map((card) => (
          <Card
            card={card}
            key={card._id}
            owner={card.owner}
            name={card.name}
            link={card.link}
            likes={card.likes}
            onCardClick={props.onCardClick}
            onCardLike={props.onCardLike}
            onCardDelete={props.onCardDelete}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
