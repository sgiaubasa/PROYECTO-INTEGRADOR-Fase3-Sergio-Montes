import "dotenv/config";
import express from "express";
import { config as configCors } from "./config/cors.config.js";
import { config as configJson } from "./config/json.config.js";
import { connectDB } from "./config/mongoose.config.js";
import { config as configStatic } from "./config/static.config.js";

import inquiryRouter from "./routes/inquiry.router.js";
import institutionRouter from "./routes/institution.router.js";
import productRouter from "./routes/product.router.js";

const app = express();

/* ---------- Middlewares base (orden recomendado) ---------- */
configCors(app);                // CORS primero (usa FRONTEND_HOST/.env)
app.use(express.json({ limit: "2mb" })); // Parser JSON explícito (a prueba de balas)
configJson(app);                // Tu config JSON (si agrega algo extra)
configStatic(app);              // Archivos estáticos (/api/public/images)

/* ---------- Base de datos ---------- */
connectDB();

/* ---------- Rutas ---------- */
app.use("/api/institutions", institutionRouter);
app.use("/api/products", productRouter);
app.use("/api/inquiry", inquiryRouter);

/* ---------- Manejo global de errores (evita requests colgadas) ---------- */
app.use((err, req, res, next) => {
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

/* ---------- Dev server local ---------- */
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, HOST, () => {
    console.log(`Ejecutándose en http://${HOST}:${PORT}`);
  });
}

export default app;
