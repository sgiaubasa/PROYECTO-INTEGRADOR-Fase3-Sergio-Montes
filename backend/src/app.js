// backend/src/app.js
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Si tenés estos módulos, dejalos. Si no, comentá la línea y listo:
import { config as configCors } from "./config/cors.config.js";
import { config as configJson } from "./config/json.config.js";
import { connectDB } from "./config/mongoose.config.js";
import { config as configStatic } from "./config/static.config.js";

// Routers
import inquiryRouter from "./routes/inquiry.router.js";
import institutionRouter from "./routes/institution.router.js";
import productRouter from "./routes/product.router.js";
import sliderRouter from "./routes/slider.router.js";

// __dirname / __filename en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------- App ---------- */
const app = express();

/* ---------- Middlewares base ---------- */
if (configCors) configCors(app);
app.use(express.json({ limit: "2mb" }));
if (configJson) configJson(app);

/* ---------- Healthcheck (sin depender de DB) ---------- */
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "backend",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* ---------- Endpoints de diagnóstico (DB/colecciones) ---------- */
// Lista DB actual, colecciones y contadores (útil para ver si el modelo apunta a la colección correcta)
app.get("/api/debug/db", async (_req, res) => {
  try {
    const conn = mongoose.connection;
    const dbName = conn?.name;
    const host = conn?.host;
    const collections = await conn.db.listCollections().toArray();
    const colNames = collections.map((c) => c.name);

    // contadores de colecciones típicas (ajustá/añadí si usás otras)
    const toCount = [
      "products",
      "institutions",
      "producto",
      "productos",
      "Productos",
      "Product",
    ];
    const counts = {};
    for (const name of toCount) {
      try {
        counts[name] = await conn.db.collection(name).countDocuments();
      } catch {
        counts[name] = -1; // no existe
      }
    }

    res.json({
      connected: conn.readyState === 1,
      host,
      dbName,
      collections: colNames,
      counts,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Lee crudo los primeros 5 documentos de la colección "products" (nativo, sin Mongoose)
app.get("/api/debug/products/raw", async (_req, res) => {
  try {
    const rows = await mongoose.connection.db
      .collection("products")
      .find({})
      .limit(5)
      .toArray();
    res.json({ rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ---------- Archivos estáticos centralizados ---------- */
configStatic(app);

/* ---------- Conexión DB (no bloquea el arranque) ---------- */
(async () => {
  try {
    if (connectDB) {
      await connectDB();
      console.log("[db] conectada");
    } else {
      console.log("[db] connectDB no definido (saltado)");
    }
  } catch (err) {
    console.error("[db] error de conexión:", err.message);
  }
})();

/* ---------- Rutas API ---------- */
app.use("/api/inquiries", inquiryRouter || ((_req, res) => res.sendStatus(501)));
app.use("/api/institutions", institutionRouter || ((_req, res) => res.sendStatus(501)));
app.use("/api/products", productRouter || ((_req, res) => res.sendStatus(501)));
app.use("/api/sliders", sliderRouter || ((_req, res) => res.sendStatus(501)));

/* ---------- Server local (solo dev) ---------- */
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`[server] http://localhost:${PORT}`);
  });
}

export default app;
