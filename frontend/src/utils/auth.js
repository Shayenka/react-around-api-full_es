const BASE_URL = "http://127.0.0.1:3000";

export const registerUser = async (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }
    })
    .then((res) => {
      return res;
    });
};

export const authorize = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.token) {
        localStorage.setItem("jwt", data.token);
        return data;
      } else {
        console.error("La respuesta del servidor no contiene un token válido.");
      }
    } else {
      console.error("Error en la respuesta del servidor:", response.status);
    }
  } catch (err) {
    console.error("Error en la solicitud:", err);
  }
};

export const checkTokenValidity = async (token) => {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Token inválido");
  }
};
