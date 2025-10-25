import Product from "../models/product.model.js";
import ErrorService from "../services/error.service.js";
import ProductService from "../services/product.service.js";
import {
  validateCreateProduct,
  validateProductFilters,
  validateUpdateProduct,
} from "../validators/product.validator.js";

// Normaliza tipos desde multipart/form-data
const normalizeMultipartBody = (raw = {}) => {
  const out = {};

  if (raw.name !== undefined) out.name = String(raw.name ?? "").trim();
  if (raw.description !== undefined) out.description = String(raw.description ?? "").trim();

  if (raw.price !== undefined) {
    const n = Number(raw.price);
    if (!Number.isNaN(n)) out.price = n;
  }
  if (raw.stock !== undefined) {
    const n = Number(raw.stock);
    if (!Number.isNaN(n)) out.stock = n;
  }
  if (raw.highlighted !== undefined) {
    const v = raw.highlighted;
    out.highlighted = v === true || v === "true" || v === 1 || v === "1";
  }

  // Compat: si llega "image" como string (filename) y no hay thumbnail,
  // lo mapeamos a thumbnail. (NO lo pasamos al validador)
  if (typeof raw.image === "string" && raw.image.trim() && raw.thumbnail === undefined) {
    out.thumbnail = raw.image.trim();
  }

  return out;
};

// Toma archivo subido bajo image o thumbnail
const pickUploadedFile = (req) => {
  if (req.file) return req.file;
  const fImg = Array.isArray(req.files?.image) ? req.files.image[0] : null;
  const fThumb = Array.isArray(req.files?.thumbnail) ? req.files.thumbnail[0] : null;
  return fImg || fThumb || null;
};

export default class ProductController {
  #productService = new ProductService();

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
      console.log("[CREATE] ctype:", req.headers["content-type"]);
      console.log("[CREATE] body keys:", Object.keys(req.body || {}));

      const normalized = normalizeMultipartBody(req.body);
      const file = pickUploadedFile(req);

      // ---- WHITELIST para validación: SIN thumbnail ----
      const toValidate = {
        name: normalized.name,
        description: normalized.description ?? "",
        price: normalized.price,
        stock: normalized.stock,
        highlighted: normalized.highlighted ?? false,
      };

      // Validar SOLO los campos que permite el schema
      const validated = validateCreateProduct(toValidate);

      // Recién AHORA agregamos thumbnail (si hay archivo) para guardar
      if (file?.filename) {
        validated.thumbnail = file.filename;
      } else if (normalized.thumbnail) {
        // si vino como string (caso compat), también se agrega después
        validated.thumbnail = normalized.thumbnail;
      }

      const product = await this.#productService.create(validated, file);
      return res.status(201).json({ status: "success", payload: product });
    } catch (error) {
      const handledError = ErrorService.handleError(error);
      console.error("[CREATE] error:", handledError.message);
      return res.status(handledError.code).json({ status: "error", message: handledError.message });
    }
  }

  async update(req, res) {
    try {
      console.log("[UPDATE] id:", req.params?.id, "body keys:", Object.keys(req.body || {}));

      const normalized = normalizeMultipartBody(req.body);
      const file = pickUploadedFile(req);

      // ---- WHITELIST dinámico para validación: SIN thumbnail ----
      const toValidate = {};
      if (normalized.name !== undefined) toValidate.name = normalized.name;
      if (normalized.description !== undefined) toValidate.description = normalized.description;
      if (normalized.price !== undefined) toValidate.price = normalized.price;
      if (normalized.stock !== undefined) toValidate.stock = normalized.stock;
      if (normalized.highlighted !== undefined) toValidate.highlighted = normalized.highlighted;

      const validated = validateUpdateProduct(toValidate);

      // Después de validar, aplicamos thumbnail si vino archivo nuevo o string
      const toSave = { ...validated };
      if (file?.filename) toSave.thumbnail = file.filename;
      else if (normalized.thumbnail !== undefined) toSave.thumbnail = normalized.thumbnail;

      const product = await this.#productService.update(req.params.id, toSave, file);
      return res.status(200).json({ status: "success", payload: product });
    } catch (error) {
      const handledError = ErrorService.handleError(error);
      console.error("[UPDATE] error:", handledError.message);
      return res.status(handledError.code).json({ status: "error", message: handledError.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.#productService.delete(id);
      res.status(200).json({ status: "success" });
    } catch (error) {
      const handledError = ErrorService.handleError(error);
      res.status(handledError.code).json({ status: "error", message: handledError.message });
    }
  }

  async purchase(req, res) {
    try {
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
        updateOne: { filter: { _id: id, stock: { $gte: qty } }, update: { $inc: { stock: -qty } } },
      }));
      const result = await Product.bulkWrite(ops, { ordered: false });
      const updated = result.modifiedCount ?? 0;

      if (updated !== items.length) {
        const after = await Product.find(
          { _id: { $in: items.map((i) => i.id) } },
          { _id: 1, name: 1, stock: 1 },
        );
        return res.status(409).json({
          status: "conflict",
          message: "No hay stock suficiente para uno o más productos.",
          payload: after,
        });
      }
      return res.status(200).json({ status: "success", message: "Compra realizada con éxito. Stock actualizado." });
    } catch (error) {
      const handledError = ErrorService.handleError(error);
      res.status(handledError.code ?? 500).json({ status: "error", message: handledError.message ?? "Error al procesar la compra" });
    }
  }
}



