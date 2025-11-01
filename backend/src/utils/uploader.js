import multer from "multer";
import paths from "./paths.js";

import { generateNameForFile } from "./random.js";

// Configuración del almacenamiento para multer
const storage = multer.diskStorage({
    // Define el destino para almacenar las imágenes de productos subidas
    destination: (req, file, callback) => {
        callback(null, paths.imagesProducts);
    },
    // Define el nombre del archivo subido
    filename: (req, file, callback) => {
        const filename = generateNameForFile(file.originalname);
        callback(null, filename);
    },
});

const uploader = multer({ storage });

export default uploader;