import React from "react";
import closePopUp from "../images/CloseIcon.svg";

function PopupWithForm(props) {
  return (
    <section className={`popup popup_type_${props.name}`}>
      <form className="popup__container" id={props.name} noValidate>
        <img
          className="popup__close-icon"
          src={closePopUp}
          alt="Icono de una X para cerrar ventana emergente."
          onClick={props.onClose}
        />
        <h3 className="popup__title">{props.title}</h3>
        {props.children}
        <button
          type="submit"
          className="popup__button"
          onClick={props.onSubmit}
        >
          {props.submitButtonText}
        </button>
      </form>
    </section>
  );
}

export default PopupWithForm;
