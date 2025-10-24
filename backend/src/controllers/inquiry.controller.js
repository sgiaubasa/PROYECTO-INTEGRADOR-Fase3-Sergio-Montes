import nodemailer from "nodemailer";

export default class InquiryController {
    async create(req, res) {
        try {
            // Log para confirmar qué llega
            console.log("Inquiry body recibido:", req.body);

            // Aceptar claves en EN/ES y también las que usa tu form: surname, inquiry
            const {
                name, firstName, lastName, nombre, apellido, surname,
                email, correo, mail,
                phone, telefono, celular,
                message, consulta, mensaje, query, inquiry,
            } = req.body || {};

            // Nombre: usa name o combina firstName/nombre con lastName/apellido/surname
            const _name =
        (name && String(name).trim()) ||
        `${(firstName || nombre || name || "").toString().trim()} ${(lastName || apellido || surname || "").toString().trim()}`.trim();

            // Email: acepta varias claves
            const _email =
        (email && String(email).trim()) ||
        (correo && String(correo).trim()) ||
        (mail && String(mail).trim());

            // Teléfono opcional
            const _phone =
        (phone && String(phone).trim()) ||
        (telefono && String(telefono).trim()) ||
        (celular && String(celular).trim());

            // Mensaje: acepta message/consulta/mensaje/query e INQUIRY
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

            // Variables SMTP
            const required = [ "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "SMTP_RECIPIENT" ];
            const missing = required.filter((k) => !process.env[k]);
            if (missing.length) {
                return res.status(500).json({
                    status: "error",
                    message: `Faltan variables de entorno SMTP: ${missing.join(", ")}`,
                });
            }

            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT || 587),
                secure: false,
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            });

            // (Opcional) verificar conexión mientras configuras
            await transporter.verify();

            await transporter.sendMail({
                from: `"Formulario Web" <${process.env.SMTP_FROM}>`,
                to: process.env.SMTP_RECIPIENT,
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

    async verify(req, res) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT || 587),
                secure: false,
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            });
            await transporter.verify();
            return res.status(200).json({ status: "success", message: "SMTP verify OK" });
        } catch (err) {
            console.error("SMTP verify error:", err?.message || err);
            return res.status(500).json({ status: "error", message: err?.message || "SMTP verify failed" });
        }
    }
}