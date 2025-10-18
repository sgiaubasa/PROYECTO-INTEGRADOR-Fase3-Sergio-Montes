import ErrorService from "../services/error.service.js";

export const validateSchema = (schema, data) => {
    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
        const message = error.details.map((detail) => detail.message).join(", ");
        throw new ErrorService(message, ErrorService.errorCode.BAD_REQUEST);
    }

    return value;
};