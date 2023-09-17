import React, { useState, useEffect, useContext } from "react";
import PopupWithForm from "./PopupWithForm.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { ValidateName, ValidateUserDescription } from "../utils/Validator.js"

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);

  function handleSubmit(evt) {
    evt.preventDefault();

    onUpdateUser({
      name,
      about: description,
    });
  }

  function handleNameChange(evt) {
    const newName = evt.target.value;
    setName(newName);
    const error = ValidateName(newName);
    setNameError(error);
  }

  function handleDescriptionChange(evt) {
    const newDescription = evt.target.value;
    setDescription(newDescription );
    const error = ValidateUserDescription(newDescription );
    setDescriptionError(error);
  }
  return (
    <PopupWithForm
      name="editProfile"
      title="Editar perfil"
      submitButtonText="Guardar"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div>
        <input
          type="text"
          id="name"
          placeholder="Nombre"
          className="popup__text"
          required
          minLength="2"
          maxLength="20"
          value={name || ""}
          onChange={handleNameChange}
        />
        <span className="popup__input-error_main" id="name-error">{nameError}</span>
        <input
          type="text"
          id="about"
          placeholder="Acerca de mí"
          className="popup__text"
          required
          minLength="2"
          maxLength="200"
          value={description || ""}
          onChange={handleDescriptionChange}
        />
        <span className="popup__input-error_main" id="about-error">{descriptionError}</span>
      </div>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
