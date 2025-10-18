import { connect, Types } from "mongoose";

// Configuración para conectar con la base de datos MongoDB
export const connectDB = async () => {
    const URL = process.env.MONGODB_URI;

    try {
        await connect(URL);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.log("Error al conectar con MongoDB", error.message);
    }
};

// Verifica que un ID sea válido con el formato de ObjectId de MongoDB
export const isValidId = (id) => {
    return Types.ObjectId.isValid(id);
};