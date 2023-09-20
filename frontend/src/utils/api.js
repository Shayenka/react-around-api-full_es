const BASE_URL = "http://127.0.0.1:3000";

class Api {
  constructor({ address, groupId, token }) {
    this.token = token; 
    this.address = address;
    this.groupId = groupId;
  }

  _useFetch(url, method, body) {
    return fetch(url, {
      headers: {
        authorization: `Bearer ${this.token}`, 
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
      `${BASE_URL}/users/me`,
      `GET`
    ).then((result) => {
      return result;
    });
  }

  editUserInfo({name, about}) {
    return this._useFetch(
      `${BASE_URL}/users/me`,
      `PATCH`,
      { name: name, about: about }
    ).then((result) => {
      return result;
    });
  }

  getCards() {
    return this._useFetch(
      `${BASE_URL}/cards`,
      `GET`
    ).then((result) => {
      return result;
    });
  }

  changeLikeCardStatus(cardId, isLiked) {
    const method = isLiked ? "PUT" : "DELETE";
    return this._useFetch(
      `${BASE_URL}/cards/likes/${cardId}`,
      method
    ).then((result) => {
      return result;
    });
  }

  deleteCard(cardId) {
    return this._useFetch(
      `${BASE_URL}/cards/${cardId}`,
      `DELETE`
    ).then((result) => {
      return result;
    });
  }

  changeAvatarProfile(userAvatar) {
    return this._useFetch(
      `${BASE_URL}/users/me/avatar`,
      `PATCH`,
      userAvatar
    ).then((result) => {
      return result;
    });
  }

  addNewCard(name, link) {
    return this._useFetch(
      `${BASE_URL}/cards`,
      `POST`,
      { name: name, link: link }
    ).then((result) => {
      return result;
    });
  }

}

export default Api;
