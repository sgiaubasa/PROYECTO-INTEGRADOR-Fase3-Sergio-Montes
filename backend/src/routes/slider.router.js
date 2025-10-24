// backend/src/routes/slider.router.js
import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

// __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Ruta ABSOLUTA a: backend/public/images/slider  (desde routes/)
const sliderDir = path.resolve(__dirname, "..", "..", "public", "images", "slider");

router.get("/", (req, res) => {
    try {
        if (!fs.existsSync(sliderDir)) {
            console.warn("[/api/slider] Carpeta NO encontrada:", sliderDir);
            return res.json({ status: "success", payload: [] });
        }

        const files = fs
            .readdirSync(sliderDir)
            .filter((f) => /\.(png|jpe?g|webp|avif|gif)$/i.test(f))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

        console.log("[/api/slider] usando:", sliderDir, " ->", files);

        const payload = files.map((file, idx) => ({
            id: idx + 1,
            src: `/api/public/images/slider/${file}`, // se sirve por el estático de app.js
            alt: file.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "),
            order: idx + 1,
        }));

        res.json({ status: "success", payload });
    } catch (err) {
        console.error("[/api/slider] error:", err);
        res.status(500).json({ status: "error", message: "No se pudieron listar las imágenes del slider" });
    }
});

export default router;