import express from "express";

// Configuración del middleware para convertir el body de la solicitud
// y lo guarda en req.body
export const config = (app) => {
    app.use(express.json());
};