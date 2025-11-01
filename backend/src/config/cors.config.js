// backend/src/config/cors.config.js
import cors from "cors";

export const config = (app) => {
  const whitelist = [
    process.env.FRONTEND_HOST,       // dominio prod del FRONT
    /\.vercel\.app$/,                // previews de vercel
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
  ].filter(Boolean);

  app.use(
    cors({
      origin(origin, cb) {
        // requests del server o curl (sin origin) → permitir
        if (!origin) return cb(null, true);
        const ok = whitelist.some((w) => (w instanceof RegExp ? w.test(origin) : w === origin));
        return cb(ok ? null : new Error("Not allowed by CORS"), ok);
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      optionsSuccessStatus: 204,
    })
  );
};

