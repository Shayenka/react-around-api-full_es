import "../index.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

import Header from "../components/Header";
import Register from "../components/Register";
import Login from "../components/Login";
import Main from "../components/Main";
import Footer from "../components/Footer";
import EditProfilePopup from "../components/EditProfilePopup.js";
import EditAvatarPopup from "../components/EditAvatarPopup.js";
import AddPlacePopup from "../components/AddPlacePopup.js";
import ImagePopup from "../components/ImagePopup.js";
import Api from "../utils/api.js";
import { registerUser, checkTokenValidity } from "../utils/auth";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState();

  const [token, setToken] = useState(null);

  const api = new Api({
    address: "http://127.0.0.1:3000",
  });

  const [currentUser, setCurrentUser] = useState({ email: null });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      checkTokenValidity(token)
        .then((userData) => {
          setToken(token);
          setIsLoggedIn(true);
          setCurrentUser(userData);
          navigate("/");
        })
        .catch((error) => {
          console.error("Error de token:", error);
        });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (token){
    api
      .getUserInfo(token)
      .then((response) => {
        setCurrentUser(response.user);
      })
      .catch((error) => {
        console.log("Error al obtener los datos del usuario:", error);
      });
    }
  }, [token]);

  useEffect(() => {
    if (token){
    api
      .getCards(token)
      .then((response) => {
        setCards(response);
      })
      .catch((error) => {
        console.log("Error al obtener los datos de las tarjetas:", error);
      });
    }
  }, [token]);


  function handleUpdateUser(user) {
    console.log(user);
    api.editUserInfo(token, user.name, user.about).then((response) => {
      setCurrentUser(response);
      closeAllPopups();
    });
  }

  function handleUpdateAvatar(avatar) {
    const userAvatar = { avatar: avatar };
    api.changeAvatarProfile(token, userAvatar).then((response) => {
      setCurrentUser(response);
      closeAllPopups();
    });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((owner) => owner === currentUser._id);

    api.changeLikeCardStatus(token, card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    });
  }

  function handleCardDelete(card) {
    api.deleteCard(token, card._id).then(() => {
      setCards(
        cards.filter((item) => {
          return item._id !== card._id;
        })
      );
    });
  }

  function handleAddPlaceSubmit(name, link) {
    api.addNewCard(token, name, link).then((data) => {
      setCards([data, ...cards]);
      closeAllPopups();
    });
  }

  function handleCardClick(cardInfo) {
    setSelectedCard(cardInfo);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  async function handleRegisterUser(email, password) {
    try {
      const response = await registerUser(email, password);
      return response;
    } catch (error) {
      console.error("Error during user registration:", error);
      throw error;
    }
  }

  function handleLogin(data) {
    localStorage.setItem("jwt", data.token);
    setToken(data.token);
    setIsLoggedIn(true);
  }

  function handleLogout() {
    console.log("Logging out...");
    localStorage.removeItem("jwt");
    setToken(null); 
    setIsLoggedIn(false);
    navigate("/signin");
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
  }

  return (
    <div className="body">
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
          {isLoggedIn ? <Header onLogout={handleLogout} /> : null}
          <Routes>
            <Route
              path="/signin"
              element={<Login onLoggedIn={handleLogin} loggedIn={isLoggedIn} />}
              />
            <Route
              path="/signup"
              element={
                <Register onRegister={handleRegisterUser} loggedIn={isLoggedIn} />
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute
                  loggedIn={isLoggedIn}
                  component={Main}
                  onEditProfileClick={handleEditProfileClick}
                  onAddPlaceClick={handleAddPlaceClick}
                  onEditAvatarClick={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
              }
              />
          </Routes>
          {isEditProfilePopupOpen && (
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {isEditAvatarPopupOpen && (
            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            />
          )}

          {isAddPlacePopupOpen && (
            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
            />
          )}
          {selectedCard && (
            <ImagePopup selectedCard={selectedCard} onClose={closeAllPopups} />
          )}

          <Footer />
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;
