import { Router } from "express";
import InquiryController from "../controllers/inquiry.controller.js";

const router = Router();
const controller = new InquiryController();

router.post("/", controller.create.bind(controller));
router.post("/send-mail", controller.create.bind(controller));

router.get("/smtp-verify", controller.verify.bind(controller));

export default router;