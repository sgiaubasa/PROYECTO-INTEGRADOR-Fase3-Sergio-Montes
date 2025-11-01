export default class ErrorService extends Error {
    static errorCode = Object.freeze({
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
        CONFLICT: 409,
    });

    // Constructor para inicializar el mensaje y el código del error
    constructor(message, code = 500) {
        super(message);
        this.code = code;
    }

    // Método estático para manejar errores con mensajes y códigos apropiados
    static handleError(error) {
        // Verifica si el error es un ValidationError de Mongoose
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((item) => item.message);
            return new ErrorService(messages.join(",").trim(), this.errorCode.BAD_REQUEST);
        }

        // Verifica si es un código 11000, que indica un error de duplicidad en MongoDB
        if (error.code === 11000) {
            return new ErrorService(error.message, this.errorCode.CONFLICT);
        }

        // Verifica si el código del error está definido en el objeto errorCode
        if (Object.values(ErrorService.errorCode).includes(error.code)) {
            return new ErrorService(error.message, error.code);
        }

        // Para cualquier otro tipo de error, envía el mensaje y un código 500
        return new ErrorService(error.message, 500);
    }
}