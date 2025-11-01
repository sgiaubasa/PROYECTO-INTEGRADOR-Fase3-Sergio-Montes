import Joi from "joi";
import { validateSchema } from "./validator.js";

const NAME_MAX_LENGTH = 25;
const DESCRIPTION_MAX_LENGTH = 100;

const createProductSchema = Joi.object({
  name: Joi.string().trim().uppercase().max(NAME_MAX_LENGTH).required().messages({
    "string.base": "El nombre debe ser un texto",
    "string.empty": "El nombre debe estar definido",
    "string.max": `El nombre no puede tener más de ${NAME_MAX_LENGTH} caracteres`,
    "any.required": "El nombre es obligatorio",
  }),
  description: Joi.string().trim().max(DESCRIPTION_MAX_LENGTH).messages({
    "string.base": "La descripción debe ser un texto",
    "string.max": `La descripción no puede tener más de ${DESCRIPTION_MAX_LENGTH} caracteres`,
  }),
  price: Joi.number().min(1).required().messages({
    "number.base": "El precio debe ser un número",
    "number.min": "El precio debe ser mayor que 0",
    "any.required": "El precio es obligatorio",
  }),
  stock: Joi.number().min(0).required().messages({
    "number.base": "El stock debe ser un número",
    "number.min": "El stock no puede ser negativo",
    "any.required": "El stock es obligatorio",
  }),
  highlighted: Joi.boolean().default(false).messages({
    "boolean.base": "La definición de producto destacado debe ser un booleano",
    "any.required": "La definición de producto destacado es obligatoria",
  }),
}).unknown(false).messages({
  "object.unknown": "No se permiten campos adicionales",
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().uppercase().max(NAME_MAX_LENGTH).messages({
    "string.base": "El nombre debe ser un texto",
    "string.empty": "El nombre debe estar definido",
    "string.max": `El nombre no puede tener más de ${NAME_MAX_LENGTH} caracteres`,
  }),
  description: Joi.string().trim().max(DESCRIPTION_MAX_LENGTH).messages({
    "string.base": "La descripción debe ser un texto",
    "string.max": `La descripción no puede tener más de ${DESCRIPTION_MAX_LENGTH} caracteres`,
  }),
  price: Joi.number().min(1).messages({
    "number.base": "El precio debe ser un número",
    "number.min": "El precio debe ser mayor que 0",
  }),
  stock: Joi.number().min(0).messages({
    "number.base": "El stock debe ser un número",
    "number.min": "El stock no puede ser negativo",
  }),
  highlighted: Joi.boolean().messages({
    "boolean.base": "La definición de producto destacado debe ser un booleano",
  }),
}).unknown(false).messages({
  "object.unknown": "No se permiten campos adicionales",
});

const filtersProductSchema = Joi.object({
  name: Joi.string().trim().uppercase().max(NAME_MAX_LENGTH).messages({
    "string.base": "El filtro nombre debe ser un texto",
    "string.empty": "El filtro nombre debe estar definido",
    "string.max": `El filtro nombre no puede tener más de ${NAME_MAX_LENGTH} caracteres`,
  }),
  highlighted: Joi.boolean().messages({
    "boolean.base": "La definición de producto destacado debe ser un booleano",
  }),
})
// 🔐 SOLO en filtros permitimos “unknown” para tolerar params de Vercel/toolbar
.unknown(true);

export const validateCreateProduct = (data) => validateSchema(createProductSchema, data);
export const validateUpdateProduct = (data) => validateSchema(updateProductSchema, data);
export const validateProductFilters = (data) => validateSchema(filtersProductSchema, data);
