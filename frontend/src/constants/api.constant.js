// frontend/src/constants/api.constant.js

// ORIGIN del backend:
// - En dev: http://localhost:3000
// - En prod: import.meta.env.VITE_API_URL (ej.: https://proyecto-integrador-fase3-sergio-montes.onrender.com)
const RAW_ORIGIN = import.meta.env.DEV
  ? "http://localhost:3000"
  : (import.meta.env.VITE_API_URL || "");

// Normalizamos sin barra final
const ORIGIN = RAW_ORIGIN.replace(/\/+$/, "");

// API_URL siempre termina en /api (o "/api" relativo si no hay ORIGIN)
export const API_URL = ORIGIN ? (ORIGIN.endsWith("/api") ? ORIGIN : `${ORIGIN}/api`) : "/api";

// Rutas públicas de archivos estáticos
export const API_PUBLIC = `${API_URL.replace(/\/api$/, "")}/api/public`;
export const API_URL_IMAGES = `${API_PUBLIC}/images`;

// Alias (por compatibilidad si usabas "API" en otros lados)
export const API = API_URL;

