// frontend/src/constants/api.constant.js

const RAW_ORIGIN = import.meta.env.DEV
  ? "http://localhost:3000"
  : (import.meta.env.VITE_API_URL || "");

const ORIGIN = RAW_ORIGIN.replace(/\/+$/, "");
export const API_URL = ORIGIN ? (ORIGIN.endsWith("/api") ? ORIGIN : `${ORIGIN}/api`) : "/api";

export const API_PUBLIC = `${API_URL.replace(/\/api$/, "")}/api/public`;
export const API_URL_IMAGES = `${API_PUBLIC}/images`;

// Alias si usabas "API" en otros lados
export const API = API_URL;

