import React, { useState, useRef, useContext } from "react";
import PopupWithForm from "./PopupWithForm.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { ValidateLink } from "../utils/Validator.js";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const currentUser = useContext(CurrentUserContext);
  const avatar = useRef(currentUser.avatar);

  const [avatarLink, setAvatarLink] = useState("");
  const [avatarError, setAvatarError] = useState("");

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateAvatar(avatarLink);
  }

  function handleAvatarChange(evt) {
    const newLinkAvatar = evt.target.value;
    setAvatarLink(newLinkAvatar);
    const error = ValidateLink(newLinkAvatar);
    setAvatarError(error);
  }

  return (
    <PopupWithForm
      name="changeAvatar"
      title="Actualizar foto de perfil"
      submitButtonText="Guardar"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div>
        <input
          type="url"
          id="linkAvatar"
          name="link"
          placeholder="URL de la foto de perfil"
          className="popup__text"
          required
          onChange={handleAvatarChange}
          ref={avatar}
        />
        <span className="popup__input-error_main" id="linkAvatar-error">{avatarError}</span>
      </div>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
