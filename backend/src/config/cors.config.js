import cors from "cors";

export const config = (app) => {
  const whitelist = [
    process.env.FRONTEND_HOST,         // 👈 tu front exacto
    /\.onrender\.com$/,                // 👈 cualquier *.onrender.com
    /\.vercel\.app$/,                  // (si usás previews)
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
  ].filter(Boolean);

  app.use(cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      const ok = whitelist.some((w) => w instanceof RegExp ? w.test(origin) : w === origin);
      return cb(ok ? null : new Error(`Not allowed by CORS: ${origin}`), ok);
    },
    credentials: true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
    optionsSuccessStatus: 204,
  }));
  // app.options("*", cors()); // opcional
};


