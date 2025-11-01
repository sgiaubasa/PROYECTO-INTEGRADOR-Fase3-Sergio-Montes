import { Router } from "express";
import fs from "fs";
import path from "path";
import paths from "../utils/paths.js";

const router = Router();

router.get("/", (_req, res) => {
  try {
    const dir = path.join(paths.public, "images", "slider");
    const exists = fs.existsSync(dir);
    const files = exists
      ? fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg|webp|gif)$/i.test(f))
      : [];

    const payload = files.map((f, i) => ({
      id: i + 1,
      title: f.replace(/\.[^.]+$/, ""),
      image: `/api/public/images/slider/${f}`, // URL pública servida por static.config
    }));

    return res.json({ status: "success", payload });
  } catch (e) {
    console.error("[sliders] error:", e);
    return res.status(500).json({ status: "error", message: "Error leyendo sliders" });
  }
});

export default router;
