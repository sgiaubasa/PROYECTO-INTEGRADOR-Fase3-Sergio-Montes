import Joi from "joi";
import { validateSchema } from "./validator.js";

const sendInquirySchema = Joi.object({
    name: Joi
        .string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "El nombre es obligatorio",
            "string.min": "El nombre debe tener al menos 2 caracteres",
            "string.max": "El nombre no puede exceder 50 caracteres",
            "any.required": "El nombre es obligatorio",
        }),

    surname: Joi
        .string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "El apellido es obligatorio",
            "string.min": "El apellido debe tener al menos 2 caracteres",
            "string.max": "El apellido no puede exceder 50 caracteres",
            "any.required": "El apellido es obligatorio",
        }),

    phone: Joi
        .string()
        .trim()
        .pattern(/^[0-9+\-\s()]+$/)
        .min(7)
        .max(20)
        .required()
        .messages({
            "string.empty": "El teléfono es obligatorio",
            "string.pattern.base": "El teléfono debe contener solo números y caracteres válidos",
            "string.min": "El teléfono debe tener al menos 7 caracteres",
            "string.max": "El teléfono no puede exceder 20 caracteres",
            "any.required": "El teléfono es obligatorio",
        }),

    email: Joi
        .string()
        .trim()
        .pattern(/^[a-z0-9.]+@[a-z0-9-]+\.(com$|com\.[a-z0-9]{2}$)/)
        .required()
        .messages({
            "string.empty": "El email es obligatorio",
            "string.pattern.base": "El email debe ser válido",
            "any.required": "El email es obligatorio",
        }),

    inquiry: Joi
        .string()
        .trim()
        .min(10)
        .max(120)
        .required()
        .messages({
            "string.empty": "La consulta es obligatoria",
            "string.min": "La consulta debe tener al menos 10 caracteres",
            "string.max": "La consulta no puede exceder 120 caracteres",
            "any.required": "La consulta es obligatoria",
        }),
});

export const validateSendInquiry = (data) => validateSchema(sendInquirySchema, data);