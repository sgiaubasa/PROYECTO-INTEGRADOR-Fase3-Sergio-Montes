// backend/controllers/product.controller.js
import Product from "../models/product.model.js";
import ErrorService from "../services/error.service.js";
import ProductService from "../services/product.service.js";
import { deleteImageFile } from "../utils/imageFileHandler.js";
import paths from "../utils/paths.js";
import {
  validateCreateProduct,
  validateProductFilters,
  validateUpdateProduct,
} from "../validators/product.validator.js";

/* ---------- Helper de normalización para multipart/form-data ---------- */
function normalizeMultipartBody(raw = {}) {
  const out = { ...raw };

  // textos
  if (raw.name !== undefined) out.name = String(raw.name ?? "").trim();
  if (raw.description !== undefined) out.description = String(raw.description ?? "").trim();

  // números: si viene "", deja NaN para que el validador dispare el mensaje correcto
  if (raw.price !== undefined) {
    out.price =
      raw.price === "" || raw.price === null ? NaN : Number(raw.price);
  }
  if (raw.stock !== undefined) {
    out.stock =
      raw.stock === "" || raw.stock === null ? NaN : Number(raw.stock);
  }

  // booleanos (llega "true"/"false" como string)
  if (raw.highlighted !== undefined) {
    const v = raw.highlighted;
    out.highlighted = v === true || v === "true" || v === 1 || v === "1";
  }

  return out;
}

export default class ProductController {
  #productService;

  constructor() {
    this.#productService = new ProductService();
  }

  async findAll(req, res) {
    try {
      const filters = validateProductFilters(req.query);
      const products = await this.#productService.findAll(filters);
      res.status(200).json({ status: "success", payload: products });
    } catch (error) {
      const handledError = ErrorService.handleError(error);
      res.status(handledError.code).json({ status: "error", message: handledError.message });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const product = await this.#productService.findById(id);
      res.status(200).json({ status: "success", payload: product });
    } catch (error) {
      const handledError = ErrorService.handleError(error);
      res.status(handledError.code).json({ status: "error", message: handledError.message });
    }
  }

  async create(req, res) {
    try {
      console.log("\n[CREATE] body crudo:", req.body);
      console.log("[CREATE] file:", req.file);

      // Normalizar antes de validar
      const normalized = normalizeMultipartBody(req.body);
      console.log("[CREATE] normalized:", normalized);

      const values = validateCreateProduct(normalized);

      // Si multer subió archivo, setear URL pública
      if (req.file?.filename) {
        values.thumbnail = `/api/public/images/products/${req.file.filename}`;
      }
      console.log("[CREATE] values luego de validación y file:", values);

      const product = await this.#productService.create(values, req.file);
      console.log("[CREATE] creado OK:", product?._id || product?.id);

      res.status(201).json({ status: "success", payload: product });
    } catch (error) {
      if (req.file?.filename) {
        console.warn("[CREATE] error → borrando archivo subido:", req.file.filename);
        await deleteImageFile(paths.imagesProducts, req.file.filename);
      }
      const handledError = ErrorService.handleError(error);
      console.error("[CREATE] error:", handledError.message);
      res.status(handledError.code).json({ status: "error", message: handledError.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      console.log("\n[UPDATE] id:", id);
      console.log("[UPDATE] body crudo:", req.body);
      console.log("[UPDATE] file:", req.file);

      const normalized = normalizeMultipartBody(req.body);
      console.log("[UPDATE] normalized:", normalized);

      const values = validateUpdateProduct(normalized);

      if (req.file?.filename) {
        values.thumbnail = `/api/public/images/products/${req.file.filename}`;
      }
      console.log("[UPDATE] values luego de validación y file:", values);

      const product = await this.#productService.update(id, values, req.file);
      console.log("[UPDATE] actualizado OK:", product?._id || product?.id);

      res.status(200).json({ status: "success", payload: product });
    } catch (error) {
      if (req.file?.filename) {
        console.warn("[UPDATE] error → borrando archivo subido:", req.file.filename);
        await deleteImageFile(paths.imagesProducts, req.file.filename);
      }
      const handledError = ErrorService.handleError(error);
      console.error("[UPDATE] error:", handledError.message);
      res.status(handledError.code).json({ status: "error", message: handledError.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      console.log("\n[DELETE] id:", id);
      await this.#productService.delete(id);
      console.log("[DELETE] eliminado OK");
      res.status(200).json({ status: "success" });
    } catch (error) {
      const handledError = ErrorService.handleError(error);
      console.error("[DELETE] error:", handledError.message);
      res.status(handledError.code).json({ status: "error", message: handledError.message });
    }
  }

  /** Compra — descuenta stock */
  async purchase(req, res) {
    try {
      console.log("\n[PURCHASE] body:", req.body);
      const items = Array.isArray(req.body?.items) ? req.body.items : [];

      if (items.length === 0) {
        return res.status(400).json({ status: "error", message: "No hay items para comprar" });
      }

      for (const it of items) {
        if (!it?.id || typeof it?.qty !== "number" || it.qty <= 0) {
          return res.status(400).json({ status: "error", message: "Item inválido" });
        }
      }

      const ops = items.map(({ id, qty }) => ({
        updateOne: {
          filter: { _id: id, stock: { $gte: qty } },
          update: { $inc: { stock: -qty } },
        },
      }));

      const result = await Product.bulkWrite(ops, { ordered: false });
      const updated = result.modifiedCount ?? 0;

      if (updated !== items.length) {
        const after = await Product.find(
          { _id: { $in: items.map(i => i.id) } },
          { _id: 1, name: 1, stock: 1 }
        );
        return res.status(409).json({
          status: "conflict",
          message: "No hay stock suficiente para uno o más productos.",
          payload: after,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Compra realizada con éxito. Stock actualizado.",
      });
    } catch (error) {
      const handledError = ErrorService.handleError(error);
      console.error("[PURCHASE] error:", handledError.message);
      res.status(handledError.code ?? 500).json({
        status: "error",
        message: handledError.message ?? "Error al procesar la compra",
      });
    }
  }
}



