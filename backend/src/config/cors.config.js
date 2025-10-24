// backend/src/config/cors.config.js
import cors from "cors";

// Normaliza el origin (quita trailing slash)
const normalize = (s = "") => String(s).trim().replace(/\/+$/, "");

export const config = (app) => {
  const FRONTEND_HOST = normalize(process.env.FRONTEND_HOST); // ej: https://proyecto-integrador-fase3-sergio-mo.vercel.app

  const whitelist = [
    FRONTEND_HOST,                           // dominio de producción exacto
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
  ].filter(Boolean);

  app.use(
    cors({
      origin(origin, cb) {
        // llamadas sin origin (curl/postman) o same-origin → permitir
        if (!origin) return cb(null, true);

        const o = normalize(origin);

        // 1) coincide exacto con whitelist
        if (whitelist.includes(o)) return cb(null, true);

        // 2) permitir previews de Vercel (*.vercel.app)
        try {
          const { hostname, protocol } = new URL(o);
          if ((protocol === "https:" || protocol === "http:") && hostname.endsWith(".vercel.app")) {
            return cb(null, true);
          }
        } catch {
          // si falla el parseo, cae al bloqueo
        }

        console.warn(`[CORS] Bloqueado intento desde: ${origin}`);
        return cb(new Error(`CORS bloqueado para origen: ${origin}`));
      },
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      optionsSuccessStatus: 204,
    })
  );
};
