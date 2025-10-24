// frontend/src/constants/api.constant.js

const getApiBase = () => {
  if (import.meta.env.DEV) {
    return "http://localhost:3000/api"; // backend local en dev
  }
  // en prod: si definiste VITE_API_URL, úsala; si no, cae a /api (monorepo)
  return import.meta.env.VITE_API_URL ?? "/api";
};

export const API = getApiBase();
export const API_URL = API; // alias
export const API_URL_IMAGES = `${API}/public/images`;
