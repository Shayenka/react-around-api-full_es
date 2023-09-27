const BASE_URL = "http://127.0.0.1:3000";

class Api {
  constructor({ address }) {
    this.address = address;
  }

  _useFetch(token, url, method, body) {
    
    return fetch(url, {
      headers: {
        authorization: `Bearer ${token}`, 
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

  getUserInfo(token) {
    return this._useFetch(
      token,
      `${BASE_URL}/users/me`,
      `GET`
    ).then((result) => {
      return result;
    });
  }

  editUserInfo(token, name, about) {
    return this._useFetch(
      token,
      `${BASE_URL}/users/me`,
      `PATCH`,
      { name: name, about: about }
    ).then((result) => {
      return result;
    });
  }

  getCards(token) {
    return this._useFetch(
      token,
      `${BASE_URL}/cards`,
      `GET`
    ).then((result) => {
      return result;
    });
  }

  changeLikeCardStatus(token, cardId, isLiked) {
    const method = isLiked ? "PUT" : "DELETE";
    return this._useFetch(
      token,
      `${BASE_URL}/cards/likes/${cardId}`,
      method 
    ).then((result) => {
      return result;
    });
  }

  deleteCard(token, cardId) {
    return this._useFetch(
      token,
      `${BASE_URL}/cards/${cardId}`,
      `DELETE`
    ).then((result) => {
      return result;
    });
  }

  changeAvatarProfile(token, userAvatar) {
    return this._useFetch(
      token,
      `${BASE_URL}/users/me/avatar`,
      `PATCH`,
      userAvatar
    ).then((result) => {
      return result;
    });
  }

  addNewCard(token, name, link) {
    return this._useFetch(
      token,
      `${BASE_URL}/cards`,
      `POST`,
      { name: name, link: link }
    ).then((result) => {
      return result;
    });
  }

}

export default Api;
