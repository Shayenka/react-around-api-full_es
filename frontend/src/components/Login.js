import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ValidateEmail, ValidatePassword } from "../utils/Validator.js";
import logo from "../images/logo.svg";
import { authorize } from "../utils/auth.js";

function Login({ onLoggedIn, loggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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

  function handleSubmit(evt) {
    evt.preventDefault();
    if (!email || !password) {
      return;
    }
    authorize(email, password)
      .then((data) => {
        if (data.token) {
          onLoggedIn(data);
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      {location.pathname === "/signin" && !loggedIn ? (
        <section className="header">
          <img className="header__logo" src={logo} alt="logo Around The U.S" />
          <div className="header__container-texts">
            <Link
              to="/signup"
              className="header__text"
              style={{ textDecoration: "none" }}
            >
              Regístrate
            </Link>
          </div>
        </section>
      ) : null}
      <form className="container__main" onSubmit={handleSubmit}>
        <h3 className="container__main__title">Iniciar Sesión</h3>
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
          onClick={handleSubmit}
        >
          Iniciar Sesión
        </button>
        <div className="container__main__footer">
          <h4 className="container__main__text-footer">
            ¿Aún no eres miembro?
          </h4>
          <Link
            to="/signup"
            className="container__main__text-footer_link"
            style={{ textDecoration: "none" }}
          >
            Regístrate aquí
          </Link>
        </div>
      </form>
    </>
  );
}

export default Login;
