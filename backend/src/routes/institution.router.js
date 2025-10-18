import { Router } from "express";
import InstitutionController from "../controllers/institution.controller.js";

const router = Router();
const institutionController = new InstitutionController();

router.get("/first", institutionController.findFirst.bind(institutionController));

export default router;