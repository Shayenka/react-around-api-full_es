import React, { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

import { Link } from "react-router-dom";
import logo from "../images/logo.svg";


function Header({ onLogout }) {
  const currentUser = useContext(CurrentUserContext);
  return (
    <header className="header header_main">
      <img className="header__logo" src={logo} alt="logo Around The U.S" />
      <div className="header__container-texts">
        <h3 className="header__text_email">{currentUser.email}</h3>
        <Link
          to="/"
          className="header__text"
          style={{ textDecoration: "none" }}
          onClick={onLogout}
        >
          Cerrar Sesión
        </Link>
      </div>
    </header>
  );
}

export default Header;