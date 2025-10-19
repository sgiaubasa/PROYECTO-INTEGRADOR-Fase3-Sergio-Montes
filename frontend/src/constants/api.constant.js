// frontend/src/constants/api.constant.js

// Detecta entorno (local vs producción)
const getApiBase = () => {
  if (import.meta.env.DEV) {
    return "http://localhost:3000/api"; // backend local
  }
  return "/api"; // producción (Vercel, etc.)
};

// URL base de la API
export const API = getApiBase();

// Alias alternativo, por compatibilidad con algunos imports antiguos
export const API_URL = API;

// Ruta base para imágenes
export const API_URL_IMAGES = `${API}/public/images`;

