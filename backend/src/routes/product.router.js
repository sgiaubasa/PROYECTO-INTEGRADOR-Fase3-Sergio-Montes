// backend/routes/product.router.js
import { Router } from "express";
import fs from "fs/promises";
import multer from "multer";
import path from "path";
import ProductController from "../controllers/product.controller.js";
import paths from "../utils/paths.js";

const router = Router();
const controller = new ProductController();

// helper simple para nombres “seguros”
// (func-style → expresión; y quitamos escape innecesario del guion en la RegExp)
const slugify = (text) =>
    String(text || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9.-]+/g, "-") // "-" sin escape (no-useless-escape)
        .replace(/(^-|-$)/g, "");

// (func-style → expresión) y evitamos bloque vacío en catch + no-unused-vars
const ensureDir = async (dir) => {
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch {
    // no rompemos el flujo si ya existe o no tenemos permisos
    }
};

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

// Rutas (sin remover nada)
router.get("/", (req, res) => controller.findAll(req, res));
router.get("/:id", (req, res) => controller.findById(req, res));
router.post("/", upload.single("thumbnail"), (req, res) => controller.create(req, res));
router.put("/:id", upload.single("thumbnail"), (req, res) => controller.update(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));
router.post("/purchase", (req, res) => controller.purchase(req, res));

export default router;