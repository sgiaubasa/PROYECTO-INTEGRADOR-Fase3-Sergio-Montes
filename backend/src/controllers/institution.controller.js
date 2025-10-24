// backend/src/controllers/institution.controller.js
import Institution from "../models/institution.model.js";

export default class InstitutionController {
    async findFirst(req, res) {
        try {
            const inst = await Institution.findOne().lean();
            if (!inst) return res.status(404).json({ status: "error", message: "Institution not found" });
            res.json({ status: "success", payload: inst });
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: "error", message: "Internal error" });
        }
    }

    // usado por el router para crear (sin next)
    async createRaw(body) {
    // VALIDACIÓN rápida al nivel app: respeta tus límites de schema
        if (!body?.name || body.name.length > 25) {
            throw new Error("El nombre es obligatorio y debe tener máx. 25 caracteres");
        }
        return await Institution.create(body);
    }
}