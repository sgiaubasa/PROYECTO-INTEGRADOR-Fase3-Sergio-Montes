// backend/src/config/static.config.js
import express from "express";
import fs from "fs";
import path from "path";
import paths from "../utils/paths.js";

export const config = (app) => {
  // Estático general: expone /api/public/* desde /backend/public/*
  app.use("/api/public", express.static(paths.public));

  // Alias opcional corto (sirve /images/* → /public/images/*)
  app.use("/images", express.static(paths.images));

  // Ruta explícita: imágenes de productos con fallback a default.jpg
  app.get("/api/public/images/products/:file", (req, res) => {
    try {
      const fname = String(req.params.file || "").replace(/[\/\\]/g, "");
      const abs = path.join(paths.imagesProducts, fname);

      if (fs.existsSync(abs)) return res.sendFile(abs);

      const fallback = path.join(paths.public, "default.jpg");
      if (fs.existsSync(fallback)) return res.sendFile(fallback);

      return res.status(404).send("Imagen no encontrada");
    } catch (e) {
      console.error("[IMG-REQ] error:", e);
      return res.status(500).send("Error sirviendo imagen");
    }
  });

  console.log("[static] /api/public =>", paths.public);
};
