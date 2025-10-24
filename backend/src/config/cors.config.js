import cors from "cors";

export const config = (app) => {
  const whitelist = [
    process.env.FRONTEND_HOST,              // dominio principal
    /\.vercel\.app$/,                       // previews de Vercel
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
  ].filter(Boolean);

  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true);
        const ok = whitelist.some((allowed) =>
          allowed instanceof RegExp ? allowed.test(origin) : allowed === origin
        );
        return ok ? cb(null, true) : cb(new Error(`CORS bloqueado para: ${origin}`));
      },
      methods: [ "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS" ],
      allowedHeaders: [ "Content-Type", "Authorization" ],
      credentials: true,
      optionsSuccessStatus: 204,
    })
  );
};
