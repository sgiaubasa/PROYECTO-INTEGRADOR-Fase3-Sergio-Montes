import { Router } from "express";
import ProductController from "../controllers/product.controller.js";
import uploader from "../utils/uploader.js";

const router = Router();
const productController = new ProductController();

router.get("/", productController.findAll.bind(productController));
router.get("/:id", productController.findById.bind(productController));
router.post("/", uploader.single("image"), productController.create.bind(productController));
router.put("/:id", uploader.single("image"), productController.update.bind(productController));
router.delete("/:id", productController.delete.bind(productController));

export default router;