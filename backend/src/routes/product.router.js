// backend/routes/product.router.js
import { Router } from "express";
import multer from "multer";
import ProductController from "../controllers/product.controller.js";
import { uploadBufferToCloudinary } from "../services/upload.service.js"; // 👈 nuevo import

const router = Router();
const controller = new ProductController();

// Usamos memoria en lugar de disco (Vercel no permite escribir al filesystem)
const upload = multer({ storage: multer.memoryStorage() });

// ---------------------- RUTAS ----------------------

// Obtener todos los productos
router.get("/", (req, res) => controller.findAll(req, res));

// Obtener producto por ID
router.get("/:id", (req, res) => controller.findById(req, res));

// Crear producto con imagen (Cloudinary)
router.post("/", upload.single("thumbnail"), async (req, res) => {
  try {
    // si vino archivo, subimos a Cloudinary
    if (req.file?.buffer) {
      const fileName = req.file.originalname || `product_${Date.now()}.jpg`;
      const result = await uploadBufferToCloudinary(req.file.buffer, fileName);
      req.body.thumbnail = result.secure_url; // 👈 URL Cloudinary
    }
    await controller.create(req, res);
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ error: "Error subiendo imagen o creando producto" });
  }
});

// Actualizar producto (puede reemplazar imagen)
router.put("/:id", upload.single("thumbnail"), async (req, res) => {
  try {
    if (req.file?.buffer) {
      const fileName = req.file.originalname || `product_${Date.now()}.jpg`;
      const result = await uploadBufferToCloudinary(req.file.buffer, fileName);
      req.body.thumbnail = result.secure_url;
    }
    await controller.update(req, res);
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    res.status(500).json({ error: "Error subiendo imagen o actualizando producto" });
  }
});

// Eliminar producto
router.delete("/:id", (req, res) => controller.delete(req, res));

// Registrar compra
router.post("/purchase", (req, res) => controller.purchase(req, res));

export default router;
