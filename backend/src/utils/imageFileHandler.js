import fs from "fs";
import { join } from "path";

// Valida que el nombre del archivo sea válido
const ensureFilename = (filename) => {
    if (!filename) {
        throw new Error("El nombre del archivo es obligatorio");
    }
};

// Verifica si un archivo de imagen existe
export const existsImageFile = async (filepath, filename) => {
    try {
        const path = join(filepath, filename);
        await fs.promises.access(path, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
};

// Elimina un archivo de imagen de forma segura
export const deleteImageFile = async (filepath, filename) => {
    try {
        ensureFilename(filename);

        const path = join(filepath, filename);
        await fs.promises.unlink(path);
    } catch (error) {
        throw new Error(`Error al eliminar la imagen. ${error.message}`);
    }
};