import { Router } from "express";
import InquiryController from "../controllers/inquiry.controller.js";

const router = Router();
const controller = new InquiryController();

router.post("/", controller.create.bind(controller));
// ahora /send-mail usa el método nuevo (que reusa create)
router.post("/send-mail", controller.sendMail.bind(controller));

router.get("/smtp-verify", controller.verify.bind(controller));

export default router;
