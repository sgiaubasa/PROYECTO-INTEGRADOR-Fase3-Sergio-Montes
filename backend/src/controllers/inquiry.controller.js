// backend/src/controllers/inquiry.controller.js
import nodemailer from "nodemailer";

function readEnv(key, def = "") {
  const v = (process.env[key] ?? def);
  return typeof v === "string" ? v.trim() : v;
}

function buildTransport({ force465 = false } = {}) {
  const host = readEnv("SMTP_HOST");
  const port = Number(force465 ? 465 : readEnv("SMTP_PORT", "587"));
  const secure = force465 ? true : false; // 587 STARTTLS, 465 TLS directo
  const user = readEnv("SMTP_USER");
  const pass = readEnv("SMTP_PASS");

  // Logs de diagnóstico (sin exponer secretos)
  console.log("[SMTP] host:", host, "port:", port, "secure:", secure);
  console.log("[SMTP] user:", user);
  console.log("[SMTP] from:", readEnv("SMTP_FROM"));
  console.log("[SMTP] recipient:", readEnv("SMTP_RECIPIENT"));
  console.log("[SMTP] pass len:", (pass || "").length);

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    // tls: { rejectUnauthorized: false }, // <- descomentar solo si tu red rompe TLS
  });
}

export default class InquiryController {
  async create(req, res) {
    try {
      console.log("Inquiry body recibido:", req.body);

      const {
        name, firstName, lastName, nombre, apellido, surname,
        email, correo, mail,
        phone, telefono, celular,
        message, consulta, mensaje, query, inquiry,
      } = req.body || {};

      const _name =
        (name && String(name).trim()) ||
        `${(firstName || nombre || name || "").toString().trim()} ${(lastName || apellido || surname || "").toString().trim()}`.trim();

      const _email =
        (email && String(email).trim()) ||
        (correo && String(correo).trim()) ||
        (mail && String(mail).trim());

      const _phone =
        (phone && String(phone).trim()) ||
        (telefono && String(telefono).trim()) ||
        (celular && String(celular).trim());

      const _message =
        (message && String(message).trim()) ||
        (consulta && String(consulta).trim()) ||
        (mensaje && String(mensaje).trim()) ||
        (query && String(query).trim()) ||
        (inquiry && String(inquiry).trim());

      if (!_name || !_email || !_message) {
        return res.status(400).json({
          status: "error",
          message: "Nombre, email y mensaje son obligatorios",
        });
      }

      // Env requeridas
      const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "SMTP_RECIPIENT"];
      const missing = required.filter((k) => !readEnv(k));
      if (missing.length) {
        return res.status(500).json({
          status: "error",
          message: `Faltan variables de entorno SMTP: ${missing.join(", ")}`,
        });
      }

      // Brevo exige que el FROM sea el mismo user (o un dominio verificado)
      const SMTP_FROM = readEnv("SMTP_FROM");
      const SMTP_USER = readEnv("SMTP_USER");
      if (SMTP_FROM !== SMTP_USER) {
        console.warn("[SMTP] Aviso: SMTP_FROM debe ser igual a SMTP_USER en Brevo para evitar 535/EAUTH");
      }

      // 1) Intento estándar: 587 + STARTTLS (secure:false)
      let transporter = buildTransport({ force465: false });
      try {
        await transporter.verify();
      } catch (e) {
        const msg = (e?.message || "").toString();
        console.error("[SMTP verify 587] error:", msg);

        // 2) Fallback a 465 + TLS directo (secure:true)
        transporter = buildTransport({ force465: true });
        try {
          await transporter.verify();
        } catch (e2) {
          const msg2 = (e2?.message || "").toString();
          console.error("[SMTP verify 465] error:", msg2);

          // Errores típicos de auth
          if (/535|EAUTH|Invalid login/i.test(msg) || /535|EAUTH|Invalid login/i.test(msg2)) {
            return res.status(500).json({
              status: "error",
              message: "Autenticación SMTP fallida (535/EAUTH). Verifica SMTP_USER, SMTP_PASS y que SMTP_FROM sea igual al login.",
            });
          }

          return res.status(500).json({
            status: "error",
            message: "No se pudo establecer conexión SMTP (587 ni 465). Revisa red/firewall o TLS.",
          });
        }
      }

      await transporter.sendMail({
        from: `"Formulario Web" <${SMTP_FROM}>`,
        to: readEnv("SMTP_RECIPIENT"),
        subject: `Consulta de ${_name}`,
        html: `
          <h2>Nueva consulta</h2>
          <p><b>Nombre:</b> ${_name}</p>
          <p><b>Email:</b> ${_email}</p>
          <p><b>Teléfono:</b> ${_phone || "-"}</p>
          <p><b>Mensaje:</b><br/>${_message}</p>
        `,
        replyTo: _email,
      });

      return res.status(200).json({ status: "success", message: "Consulta enviada" });
    } catch (err) {
      console.error("Inquiry error:", err?.message || err);
      return res.status(500).json({ status: "error", message: "No se pudo enviar la consulta" });
    }
  }

  // Alias para /send-mail
  async sendMail(req, res) {
    return this.create(req, res);
  }

  async verify(_req, res) {
    try {
      // probamos primero 587 (STARTTLS), luego 465 (TLS)
      try {
        await buildTransport({ force465: false }).verify();
        return res.status(200).json({ status: "success", message: "SMTP verify OK (587)" });
      } catch (e) {
        console.warn("[SMTP verify] 587 falló, probando 465…", e?.message || e);
        await buildTransport({ force465: true }).verify();
        return res.status(200).json({ status: "success", message: "SMTP verify OK (465)" });
      }
    } catch (err) {
      console.error("SMTP verify error:", err?.message || err);
      return res.status(500).json({ status: "error", message: err?.message || "SMTP verify failed" });
    }
  }
}
