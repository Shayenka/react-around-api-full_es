import closePopUp from "../images/CloseIcon.svg";

function ImagePopup({ selectedCard, onClose }) {
  function handleCloseClick() {
    onClose();
  }
  return (
    <section className="popup" id="popupImage">
      <div className="image-show">
        <img
          className="image-show__close-icon"
          src={closePopUp}
          alt="Icono de una X para cerrar imagen."
          onClick={handleCloseClick}
        />
        <img
          className="image-show__popup"
          src={selectedCard.link}
          alt={selectedCard.name}
        />
        <h3 className="image-show__title">{selectedCard.name}</h3>
      </div>
    </section>
  );
}

export default ImagePopup;
