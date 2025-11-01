// backend/utils/imageFileHandler.js
import fs from "fs/promises";
import path from "path";

/**
 * Verifica si un archivo de imagen existe en el directorio indicado.
 * Mantiene la firma que usa product.service.js: (dir, filename) -> Promise<boolean>
 */
// (func-style → expresión)
export const existsImageFile = async (dir, filename) => {
    if (!dir || !filename) return false;

    // Soporta si llegan rutas web: nos quedamos con el basename
    const safeName = path.basename(filename);
    const fullPath = path.join(dir, safeName);

    try {
        await fs.access(fullPath);
        return true;
    } catch (err) {
        if (err?.code === "ENOENT") return false;
        console.error(`[IMG] existsImageFile → error no-ENOENT al acceder ${fullPath}:`, err?.message);
        // En caso de error inesperado devolvemos false para no romper el flujo
        return false;
    }
};

/**
 * Elimina un archivo dentro de un directorio dado.
 * - Ignora ENOENT (archivo inexistente) para no convertir el cleanup en un 500.
 * - Loguea lo que hace para facilitar la depuración.
 * Mantiene la firma que usa product.service.js: (dir, filename) -> Promise<void>
 */
// (func-style → expresión)
export const deleteImageFile = async (dir, filename) => {
    if (!dir || !filename) return;

    const safeName = path.basename(filename);
    const fullPath = path.join(dir, safeName);

    try {
        console.log(`[IMG] deleteImageFile → intentando borrar: ${fullPath}`);
        await fs.unlink(fullPath);
        console.log(`[IMG] deleteImageFile → borrado OK: ${fullPath}`);
    } catch (err) {
        if (err?.code === "ENOENT") {
            console.warn(`[IMG] deleteImageFile → no existe, se ignora: ${fullPath}`);
            return;
        }
        console.error(`[IMG] deleteImageFile → error no-ENOENT al borrar ${fullPath}:`, err?.message);
        // Re-emitimos como Error legible (manteniendo tu mensaje)
        throw new Error(`Error al eliminar la imagen. ${err?.message}`);
    }
};