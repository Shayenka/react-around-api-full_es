import React, { useState } from "react";
import PopupWithForm from "./PopupWithForm";
import { ValidateLink, ValidateName } from "../utils/Validator.js"

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [placeName, setPlaceName] = useState("");
  const [placeLink, setPlaceLink] = useState("");

  const [placeNameError, setPlaceNameError] = useState("");
  const [placeLinkError, setPlaceLinkError] = useState("");

  function handleSubmit(evt) {
    evt.preventDefault();
    onAddPlace(placeName, placeLink);
  }

  function onNameChange(evt) {
    const newNamePlace = evt.target.value;
    setPlaceName(newNamePlace);
    const error = ValidateName(newNamePlace);
    setPlaceNameError(error);
  }

  function onLinkChange(evt) {
    const newLinkPlace = evt.target.value;
    setPlaceLink(newLinkPlace);
    const error = ValidateLink(newLinkPlace);
    setPlaceLinkError(error);
  }

  return (
    <PopupWithForm
      name="addCard"
      title="Nuevo lugar"
      submitButtonText="Crear"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div>
        <input
          type="text"
          id="titulo"
          name="name"
          placeholder="Titulo"
          className="popup__text"
          required
          minLength="2"
          maxLength="20"
          onChange={onNameChange}
        />
        <span className="popup__input-error_main" id="titulo-error">{placeNameError}</span>
        <input
          type="url"
          id="enlace"
          name="link"
          placeholder="URL de la imagen"
          className="popup__text"
          required
          onChange={onLinkChange}
        />
        <span className="popup__input-error_main" id="enlace-error">{placeLinkError}</span>
      </div>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
