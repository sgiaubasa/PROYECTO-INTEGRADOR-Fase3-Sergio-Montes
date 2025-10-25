import { Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import ProductController from "../controllers/product.controller.js";

const router = Router();
const controller = new ProductController();

const WINDOWS_PRODUCTS_DIR =
  "C:\\Users\\sergio.montes\\Desktop\\PROYECTO-INTEGRADOR-Fase3-Sergio-Montes-main\\backend\\public\\images\\products";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      if (!fs.existsSync(WINDOWS_PRODUCTS_DIR)) {
        fs.mkdirSync(WINDOWS_PRODUCTS_DIR, { recursive: true });
      }
      cb(null, WINDOWS_PRODUCTS_DIR);
    } catch (err) {
      cb(err);
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

const upload = multer({ storage });

// Aceptamos archivo bajo "image" o "thumbnail"
const acceptImageFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

router.get("/", (req, res) => controller.findAll(req, res));
router.get("/:id", (req, res) => controller.findById(req, res));

router.post("/", acceptImageFields, (req, res) => controller.create(req, res));
router.put("/:id", acceptImageFields, (req, res) => controller.update(req, res));

router.delete("/:id", (req, res) => controller.delete(req, res));
router.post("/purchase", (req, res) => controller.purchase(req, res));

export default router;






