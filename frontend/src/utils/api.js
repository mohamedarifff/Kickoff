import axios from "axios";

const API = axios.create({

  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://kickoff-gzmc.onrender.com/api",

});

/* =========================================
   REQUEST INTERCEPTOR
========================================= */

API.interceptors.request.use(
  (config) => {

    const orgToken =
      localStorage.getItem(
        "orgToken"
      );

    const supportToken =
      localStorage.getItem(
        "supportToken"
      );

    if (orgToken) {

      config.headers.Authorization =
        `Bearer ${orgToken}`;

    }

    if (supportToken) {

      config.headers.Authorization =
        `Bearer ${supportToken}`;

    }

    return config;

  }
);

/* =========================================
   RESPONSE INTERCEPTOR
========================================= */

API.interceptors.response.use(

  (response) => response,

  (error) => {

    if (
      error.response?.status ===
      401
    ) {

      localStorage.removeItem(
        "orgToken"
      );

      localStorage.removeItem(
        "supportToken"
      );

    }

    return Promise.reject(
      error
    );

  }

);

export default API;