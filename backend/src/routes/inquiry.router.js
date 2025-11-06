// backend/src/routes/inquiry.router.js
import { Router } from "express";
import InquiryController from "../controllers/inquiry.controller.js";

const router = Router();
const controller = new InquiryController();

/* --- CORS preflight explícito para este grupo de rutas (defensivo) --- */
router.options("/", (_req, res) => res.sendStatus(204));
router.options("/send-mail", (_req, res) => res.sendStatus(204));
router.options("/smtp-verify", (_req, res) => res.sendStatus(204));
router.options("/debug-env", (_req, res) => res.sendStatus(204));

/* --- Endpoints principales --- */
router.post("/", controller.create.bind(controller));
// alias que reusa "create"
router.post("/send-mail", controller.sendMail.bind(controller));

/* --- Verificación SMTP (útil si caemos al fallback SMTP) --- */
router.get("/smtp-verify", controller.verify.bind(controller));

/* --- ⚙️ DEBUG: ver ENV claves (NO expone secretos) --- */
router.get("/debug-env", (_req, res) => {
  const safe = (v) => (typeof v === "string" ? v.trim() : v);
  res.json({
    node_env: safe(process.env.NODE_ENV),
    has_brevo_api: !!safe(process.env.BREVO_API_KEY),
    brevo_sender: safe(process.env.BREVO_SENDER_EMAIL),   // remitente verificado
    brevo_recipient: safe(process.env.BREVO_RECIPIENT),
    // pistas por si cae al SMTP
    smtp_from: safe(process.env.SMTP_FROM),
    smtp_user: safe(process.env.SMTP_USER) ? "(set)" : "",
  });
});

export default router;

