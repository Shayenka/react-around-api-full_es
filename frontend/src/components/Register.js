import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { ValidateEmail, ValidatePassword } from "../utils/Validator.js";
import logo from "../images/logo.svg";
import { PopUpSuccessfulRegister, PopUpFailedRegister } from "./InfoTooltip.js";

function Register({ onRegister, loggedIn }) {
  const currentUser = useContext(CurrentUserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPopupSuccessfulRegister, setShowPopupSuccessfulRegister] =
    useState(false);
  const [showPopupFailedRegister, setShowPopupFailedRegister] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setEmail(currentUser.email);
    setPassword(currentUser.password);
  }, [currentUser]);

  function handleEmailChange(evt) {
    const newEmail = evt.target.value;
    setEmail(newEmail);
    const error = ValidateEmail(newEmail);
    setEmailError(error);
  }

  function handlePasswordChange(evt) {
    const newPassword = evt.target.value;
    setPassword(newPassword);
    const error = ValidatePassword(newPassword);
    setPasswordError(error);
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      const userRegistered = await onRegister(email, password);
      // const userRegistered = await fetch(`http://127.0.0.1:3000/signup`, {
      //   method: "POST",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ email, password }),
      // })

      if (userRegistered) {
        setShowPopupSuccessfulRegister(true);
        setShowPopupFailedRegister(false);
        setTimeout(() => {
          navigate("/signin");
        },2000)
      } else {
        setShowPopupFailedRegister(true);
        setShowPopupSuccessfulRegister(false);
        console.log("Error en el registo de usuario.");
      }
    } catch (error) {
      console.error("Error en el registo de usuario:", error);
    }
  };

  return (
    <>
      {location.pathname === "/signup" && !loggedIn ? (
        <section className="header">
          <img className="header__logo" src={logo} alt="logo Around The U.S" />
          <div className="header__container-texts">
            <Link
              to="/signin"
              className="header__text"
              style={{ textDecoration: "none" }}
            >
              Iniciar Sesión
            </Link>
          </div>
        </section>
      ) : null}
      <form className="container__main" onSubmit={handleSubmit}>
        <h3 className="container__main__title">Regístrate</h3>
        <div>
          <input
            type="text"
            id="email"
            placeholder="Correo electrónico"
            className="container__main__text"
            required
            minLength="2"
            maxLength="40"
            value={email || ""}
            onChange={handleEmailChange}
          />
          <span className="popup__input-error" id="email-error">
            {emailError}
          </span>
          <input
            type="password"
            id="password"
            placeholder="Contraseña"
            className="container__main__text"
            required
            minLength="2"
            maxLength="200"
            value={password || ""}
            onChange={handlePasswordChange}
          />
          <span className="popup__input-error" id="password-error">
            {passwordError}
          </span>
        </div>
        <button
          type="submit"
          className="container__main__button"
        >
          Regístrate
        </button>
        <div className="container__main__footer">
          <h4 className="container__main__text-footer">¿Ya eres miembro?</h4>
          <Link
            to="/signin"
            className="container__main__text-footer_link"
            style={{ textDecoration: "none" }}
          >
            Inicia sesión aquí
          </Link>
        </div>
      </form>
      {showPopupSuccessfulRegister && (
        <PopUpSuccessfulRegister
          isOpen={true}
          onClose={() => setShowPopupSuccessfulRegister(false)}
        />
      )}
      {showPopupFailedRegister && (
        <PopUpFailedRegister
          isOpen={true}
          onClose={() => setShowPopupFailedRegister(false)}
        />
      )}
    </>
  );
}

export default Register;
