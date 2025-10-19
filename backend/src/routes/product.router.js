import { Router } from "express";
import multer from "multer";
import ProductController from "../controllers/product.controller.js";
import paths from "../utils/paths.js"; // ya lo usás en el controller

const router = Router();
const productController = new ProductController();

/**
 * paths.imagesProducts debería ser algo como:
 *   path.resolve(__dirname, "..", "public", "images", "products")
 * y tu static sirve '/api/public' desde 'public'
 */

// Storage: guarda SIEMPRE en /public/images/products y usa el nombre original
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, paths.imagesProducts),
  filename: (req, file, cb) => cb(null, file.originalname),
});

// Opcional: limitar a imágenes
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

// ⚠️ ESTA es la clave para Postman: el campo debe llamarse 'thumbnail'
router.post("/", upload.single("thumbnail"), productController.create.bind(productController));

router.put("/:id", upload.single("thumbnail"), productController.update.bind(productController));
router.delete("/:id", productController.delete.bind(productController));

export default router;

