import express from "express";
import paths from "../utils/paths.js";

export const config = (app) => {
    // Ruta principal que ya tenés
    app.use("/api/public", express.static(paths.public));

    // Alias opcional corto
    app.use("/images", express.static(`${paths.public}/images`));
};