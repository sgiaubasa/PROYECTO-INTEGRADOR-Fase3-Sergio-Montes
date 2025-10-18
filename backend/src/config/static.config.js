import express from "express";
import paths from "../utils/paths.js";

// Configuración para servir archivos estáticos
export const config = (app) => {
    // Configura el middleware para servir archivos estáticos desde la
    // ruta "/api/public" hacia el directorio definido en paths.public
    app.use("/api/public", express.static(paths.public));
};