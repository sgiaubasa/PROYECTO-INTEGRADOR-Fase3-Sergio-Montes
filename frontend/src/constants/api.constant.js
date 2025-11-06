// frontend/src/constants/api.constant.js

// ORIGIN del backend:
// - Dev: http://localhost:3000
// - Prod: VITE_API_URL o (fallback) tu backend en Render
const RAW_ORIGIN = import.meta.env.DEV
  ? "http://localhost:3000"
  : (import.meta.env.VITE_API_URL || "https://proyecto-integrador-fase3-sergio-montes.onrender.com");

// Normalizamos sin barra final
const ORIGIN = RAW_ORIGIN.replace(/\/+$/, "");

// API_URL siempre termina en /api (o "/api" relativo si no hay ORIGIN —pero acá siempre hay)
export const API_URL = ORIGIN.endsWith("/api") ? ORIGIN : `${ORIGIN}/api`;

// Rutas públicas de archivos estáticos
export const API_PUBLIC = `${API_URL.replace(/\/api$/, "")}/api/public`;
export const API_URL_IMAGES = `${API_PUBLIC}/images`;

// Alias (usalo en todos tus fetch)
export const API = API_URL;


