// backend/src/routes/institution.router.js
import { Router } from "express";
import InstitutionController from "../controllers/institution.controller.js";
import Institution from "../models/institution.model.js";

const router = Router();
const institutionController = new InstitutionController();

router.get("/first", institutionController.findFirst.bind(institutionController));

router.post("/", async (req, res) => {
    try {
        console.log("POST /api/institutions body =>", req.body);
        if (!req.body?.name || req.body.name.length > 25) {
            return res.status(400).json({
                status: "error",
                message: "El nombre es obligatorio y debe tener máx. 25 caracteres",
            });
        }
        const created = await Institution.create(req.body);
        return res.status(201).json({ status: "success", payload: created });
    } catch (error) {
        console.error("ERROR creando institución:", error);
        return res
            .status(400)
            .json({ status: "error", message: error?.message || "Error al crear institución" });
    }
});

export default router;