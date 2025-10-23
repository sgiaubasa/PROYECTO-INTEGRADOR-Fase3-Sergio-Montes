// backend/src/app.js
import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { config as configCors } from "./config/cors.config.js";
import { config as configJson } from "./config/json.config.js";
import { connectDB } from "./config/mongoose.config.js";
import { config as configStatic } from "./config/static.config.js";

import inquiryRouter from "./routes/inquiry.router.js";
import institutionRouter from "./routes/institution.router.js";
import productRouter from "./routes/product.router.js";
import sliderRouter from "./routes/slider.router.js";

/* ---------- App ---------- */
const app = express();

/* ---------- Middlewares base ---------- */
configCors(app);
app.use(express.json({ limit: "2mb" }));
configJson(app);
configStatic(app);

/* ---------- Healthcheck (siempre arriba y sin depender de DB) ---------- */
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

/* ---------- Exponer /api/public/images (seguro) ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesPath = path.resolve(__dirname, "../public/images");
app.use("/api/public/images", express.static(imagesPath));

/* ---------- Conexión a base de datos (no bloquear la función) ---------- */
const hasMongoUri = !!process.env.MONGODB_URI;

/**
 * En serverless la función se “carga” en cada invocación fría.
 * Intentamos conectar si hay URI, pero si falla NO tiramos la app.
 */
if (hasMongoUri) {
  (async () => {
    try {
      await connectDB();
      console.log("MongoDB conectado correctamente.");
    } catch (err) {
      console.error("Error conectando a MongoDB:", err?.message || err);
      // No lanzamos error para que /api/health siga funcionando
    }
  })();
} else {
  console.warn("MONGODB_URI no está definido. Saltando conexión a MongoDB.");
}

/* ---------- Rutas de negocio ---------- */
app.use("/api/institutions", institutionRouter);
app.use("/api/products", productRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/slider", sliderRouter);

/* ---------- Manejo global de errores ---------- */
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    status: "error",
    message: err?.message || "Internal Server Error",
  });
});

/* ---------- 404 ---------- */
app.use((req, res) => {
  res
    .status(404)
    .send("<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>");
});

/* ---------- Dev server local (NUNCA en Vercel) ---------- */
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, HOST, () => {
    console.log(`Ejecutándose en http://${HOST}:${PORT}`);
  });
}

export default app;





