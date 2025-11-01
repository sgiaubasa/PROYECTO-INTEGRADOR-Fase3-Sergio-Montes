import { Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import ProductController from "../controllers/product.controller.js";

const router = Router();
const controller = new ProductController();

/* ============================
   Directorio de imágenes (PORTABLE, sin depender de process.cwd())
   - Usa env UPLOAD_PRODUCTS_DIR si está definida
   - Fallback: backend/public/images/products (resuelto relativo a ESTE archivo)
============================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// src/routes → subir 2 niveles a backend/, luego public/images/products
const DEFAULT_PRODUCTS_DIR = path.resolve(__dirname, "../../public/images/products");
const PRODUCTS_DIR = process.env.UPLOAD_PRODUCTS_DIR || DEFAULT_PRODUCTS_DIR;

/* ============================
   Storage de multer
============================ */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      if (!fs.existsSync(PRODUCTS_DIR)) {
        fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
      }
      cb(null, PRODUCTS_DIR);
    } catch (err) {
      cb(err);
    }
  },
  filename: (_req, file, cb) => {
    const ext = (path.extname(file.originalname) || ".jpg").toLowerCase();
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "_")
      .replace(/[^\w.-]/g, "");
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

const upload = multer({ storage });

/* Aceptamos archivo bajo "image" o "thumbnail" */
const acceptImageFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

/* ============================
   Rutas REST
============================ */
router.get("/", (req, res) => controller.findAll(req, res));
router.get("/:id", (req, res) => controller.findById(req, res));

router.post("/", acceptImageFields, (req, res) => controller.create(req, res));
router.put("/:id", acceptImageFields, (req, res) => controller.update(req, res));

router.delete("/:id", (req, res) => controller.delete(req, res));
router.post("/purchase", (req, res) => controller.purchase(req, res));

/* ============================
   Debug (opcional): ver dónde guarda multer
============================ */
router.get("/debug/upload-dir", (_req, res) => {
  res.json({
    PRODUCTS_DIR,
    exists: fs.existsSync(PRODUCTS_DIR),
    entries: fs.existsSync(PRODUCTS_DIR) ? fs.readdirSync(PRODUCTS_DIR) : [],
  });
});

export default router;







