import ErrorService from "../services/error.service.js";
import ProductService from "../services/product.service.js";
import { deleteImageFile } from "../utils/imageFileHandler.js";
import paths from "../utils/paths.js";
import {
  validateCreateProduct,
  validateProductFilters,
  validateUpdateProduct,
} from "../validators/product.validator.js";

/** ⬇️ Importo el modelo directamente para la compra en bulk */
import Product from "../models/product.model.js";

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
      const values = validateCreateProduct(req.body);

      // si multer subió archivo, setear la URL pública que sirve app.js
      if (req.file?.filename) {
        values.thumbnail = `/api/public/images/products/${req.file.filename}`;
      }

      const product = await this.#productService.create(values, req.file);
      res.status(201).json({ status: "success", payload: product });
    } catch (error) {
      if (req.file?.filename) {
        await deleteImageFile(paths.imagesProducts, req.file.filename);
      }
      const handledError = ErrorService.handleError(error);
      res.status(handledError.code).json({ status: "error", message: handledError.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const values = validateUpdateProduct(req.body);

      if (req.file?.filename) {
        values.thumbnail = `/api/public/images/products/${req.file.filename}`;
      }

      const product = await this.#productService.update(id, values, req.file);
      res.status(200).json({ status: "success", payload: product });
    } catch (error) {
      if (req.file?.filename) {
        await deleteImageFile(paths.imagesProducts, req.file.filename);
      }
      const handledError = ErrorService.handleError(error);
      res.status(handledError.code).json({ status: "error", message: handledError.message });
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

  /** ✅ NUEVO: compra — descuenta stock en DB de forma segura */
  async purchase(req, res) {
    try {
      const items = Array.isArray(req.body?.items) ? req.body.items : [];
      // items => [{ id: "mongoId", qty: 2 }, ...]

      if (items.length === 0) {
        return res.status(400).json({ status: "error", message: "No hay items para comprar" });
      }

      for (const it of items) {
        if (!it?.id || typeof it?.qty !== "number" || it.qty <= 0) {
          return res.status(400).json({ status: "error", message: "Item inválido" });
        }
      }

      // Bulk con condición de stock suficiente
      const ops = items.map(({ id, qty }) => ({
        updateOne: {
          filter: { _id: id, stock: { $gte: qty } },
          update: { $inc: { stock: -qty } },
        },
      }));

      const result = await Product.bulkWrite(ops, { ordered: false });
      const updated = result.modifiedCount ?? 0;

      if (updated !== items.length) {
        // Al menos uno no actualizó (stock insuficiente o id inválido)
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
      res.status(handledError.code ?? 500).json({
        status: "error",
        message: handledError.message ?? "Error al procesar la compra",
      });
    }
  }
}



