import React from "react";
import PopUpRegisterImage from "../images/Registrado.png";
import PopUpFailedRegisterImage from "../images/NoRegistrado.png";
import closePopUp from "../images/CloseIcon.svg";

export function PopUpSuccessfulRegister(props) {
  return (
    <section
      className={`popup__container-register ${
        props.isOpen ? "" : "popup_closed"
      }`}
    >
      <img
        className="popup__close-icon-register"
        src={closePopUp}
        alt="Icono de una X para cerrar ventana emergente."
        onClick={props.onClose}
      />
      <img
        className="popup__image-Register"
        src={PopUpRegisterImage}
        alt="Ventana emergente de registro de usuario exitoso"
      />
    </section>
  );
}

export function PopUpFailedRegister(props) {
  return (
    <section
      className={`popup__container-register ${
        props.isOpen ? "" : "popup_closed"
      }`}
    >
      <img
        className="popup__close-icon-register"
        src={closePopUp}
        alt="Icono de una X para cerrar ventana emergente."
        onClick={props.onClose}
      />
      <img
        className="popup__image-Register"
        src={PopUpFailedRegisterImage}
        alt="Ventana emergente de registro de usuario fallido"
      />
    </section>
  );
}
