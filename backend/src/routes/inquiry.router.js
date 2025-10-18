import { Router } from "express";
import inquiryController from "../controllers/inquiry.controller.js";

const router = Router();

router.post("/send-mail", inquiryController.sendMail.bind(inquiryController));

export default router;