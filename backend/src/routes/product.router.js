// backend/routes/product.router.js
import { Router } from "express";
import fs from "fs/promises";
import multer from "multer";
import path from "path";
import ProductController from "../controllers/product.controller.js";
import paths from "../utils/paths.js"; // asumo que tenés paths.imagesProducts definido

const router = Router();
const controller = new ProductController();

// helper simple para nombres “seguros”
function slugify(text) {
  return String(text || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.\-]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function ensureDir(dir) {
  try { await fs.mkdir(dir, { recursive: true }); } catch {}
}

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await ensureDir(paths.imagesProducts);
      cb(null, paths.imagesProducts);
    } catch (e) {
      cb(e);
    }
  },
  filename: (req, file, cb) => {
    // Preferimos basar el nombre en "name" cuando exista
    const base = slugify(req.body?.name) || Date.now().toString();
    const orig = slugify(file.originalname || "image.png");
    const ext = path.extname(orig) || ".png";
    // prefijo timestamp para unicidad
    const filename = `${Date.now()}-${base}${ext}`;
    console.log(`[MULTER] filename → ${filename}`);
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Rutas (no removemos nada)
router.get("/", (req, res) => controller.findAll(req, res));
router.get("/:id", (req, res) => controller.findById(req, res));
router.post("/", upload.single("thumbnail"), (req, res) => controller.create(req, res));
router.put("/:id", upload.single("thumbnail"), (req, res) => controller.update(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));
router.post("/purchase", (req, res) => controller.purchase(req, res));

export default router;




