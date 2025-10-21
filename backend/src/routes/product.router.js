import { Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import ProductController from "../controllers/product.controller.js";

const router = Router();
const productController = new ProductController();

/** Carpeta robusta, independientemente del cwd */
const imagesDir = path.join(process.cwd(), "backend", "public", "images", "products");
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  // si preferís conservar el original, dejá file.originalname; si no, generá uno único
  filename: (req, file, cb) => cb(null, file.originalname),
});

const fileFilter = (req, file, cb) => {
  if (/^image\//.test(file.mimetype)) return cb(null, true);
  cb(new Error("Solo se permiten imágenes"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Rutas
router.get("/", productController.findAll.bind(productController));
router.get("/:id", productController.findById.bind(productController));

// 👇 Campo del archivo DEBE ser 'thumbnail' (coincide con el frontend)
router.post("/", upload.single("thumbnail"), productController.create.bind(productController));
router.put("/:id", upload.single("thumbnail"), productController.update.bind(productController));
router.delete("/:id", productController.delete.bind(productController));

export default router;


