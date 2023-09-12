class Api {
  constructor({ address, groupId, token }) {
    this.authorization = token;
    this.address = address;
    this.groupId = groupId;
  }

  _useFetch(url, method, body) {
    return fetch(url, {
      headers: {
        authorization: this.authorization,
        "Content-Type": "application/json",
      },
      method,
      body: JSON.stringify(body),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  getUserInfo() {
    return this._useFetch(
      "https://around.nomoreparties.co/v1/web_es_05/users/me",
      `GET`
    ).then((result) => {
      return result;
    });
  }

  editUserInfo(name, about) {
    return this._useFetch(
      "https://around.nomoreparties.co/v1/web_es_05/users/me",
      `PATCH`,
      { name: name, about: about }
    ).then((result) => {
      return result;
    });
  }

  getCards() {
    return this._useFetch(
      "https://around.nomoreparties.co/v1/web_es_05/cards",
      `GET`
    ).then((result) => {
      return result;
    });
  }

  changeLikeCardStatus(cardId, isLiked) {
    const method = isLiked ? "PUT" : "DELETE";
    return this._useFetch(
      `https://around.nomoreparties.co/v1/web_es_05/cards/likes/${cardId}`,
      method
    ).then((result) => {
      return result;
    });
  }

  deleteCard(cardId) {
    return this._useFetch(
      `https://around.nomoreparties.co/v1/web_es_05/cards/${cardId}`,
      `DELETE`
    ).then((result) => {
      return result;
    });
  }

  changeAvatarProfile(userAvatar) {
    return this._useFetch(
      "https://around.nomoreparties.co/v1/web_es_05/users/me/avatar",
      `PATCH`,
      userAvatar
    ).then((result) => {
      return result;
    });
  }

  addNewCard(name, link) {
    return this._useFetch(
      "https://around.nomoreparties.co/v1/web_es_05/cards",
      `POST`,
      { name: name, link: link }
    ).then((result) => {
      return result;
    });
  }

  async registerUserApi(email, password) {
    return this._useFetch(`https://register.nomoreparties.co/signup`, `POST`, {
      email,
      password,
    })
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => console.log(err));
  }
}

export default Api;
