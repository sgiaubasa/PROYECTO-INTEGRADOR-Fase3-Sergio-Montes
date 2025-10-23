// backend/app.js
import "dotenv/config";
import express from "express";
import path from "path";
import { config as configCors } from "./config/cors.config.js";
import { config as configJson } from "./config/json.config.js";
import { connectDB } from "./config/mongoose.config.js";
import { config as configStatic } from "./config/static.config.js";

import inquiryRouter from "./routes/inquiry.router.js";
import institutionRouter from "./routes/institution.router.js";
import productRouter from "./routes/product.router.js";
import sliderRouter from "./routes/slider.router.js"; // ✅ NUEVO

const app = express();

/* ---------- Middlewares base ---------- */
configCors(app);
app.use(express.json({ limit: "2mb" }));
configJson(app);
configStatic(app);

/* ---------- Exponer /api/public/images ---------- */
app.use(
  "/api/public/images",
  express.static(path.join(process.cwd(), "backend", "public", "images"))
);

/* ---------- Base de datos ---------- */
connectDB();

/* ---------- Rutas ---------- */
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/institutions", institutionRouter);
app.use("/api/products", productRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/slider", sliderRouter); // ✅ NUEVA RUTA

/* ---------- Manejo global de errores ---------- */
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

/* ---------- Dev server ---------- */
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, HOST, () => {
    console.log(`Ejecutándose en http://${HOST}:${PORT}`);
  });
}

export default app;





