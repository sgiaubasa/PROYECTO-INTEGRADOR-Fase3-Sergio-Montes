import fs from "fs";
import path from "path";
import paths from "./paths.js";

// Valida que el nombre del archivo sea válido
const ensureFilename = (filename) => {
    if (!filename) {
        throw new Error("El nombre del archivo es obligatorio");
    }
};

// Lee el contenido de un archivo Json
export const readJsonFile = async (filename) => {
    try {
        ensureFilename(filename);

        const pathFile = path.join(paths.data, filename);
        const content = await fs.promises.readFile(pathFile, "utf8");
        return JSON.parse(content || "[]");
    } catch (error) {
        throw new Error(`Error al leer el archivo Json. ${error.message}`);
    }
};

// Escribe contenido en un archivo Json
export const writeJsonFile = async (filename, data) => {
    try {
        ensureFilename(filename);

        const pathFile = path.join(paths.data, filename);
        const dataJson = JSON.stringify(data, null, "\t");
        await fs.promises.writeFile(pathFile, dataJson, "utf8");
    } catch (error) {
        throw new Error(`Error al escribir el archivo Json. ${error.message}`);
    }
};