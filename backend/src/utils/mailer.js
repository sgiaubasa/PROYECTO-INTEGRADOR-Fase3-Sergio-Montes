// backend/src/utils/mailer.js
import nodemailer from "nodemailer";

// Lee variables de entorno con default
const read = (k, d = "") => (process.env[k] ?? d)?.toString().trim();

/* ---------------- Utils ---------------- */

// AbortController para cortar fetch (API HTTP)
function withTimeout(ms) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, clear: () => clearTimeout(id) };
}

/* ---------------- Brevo API (HTTP) ---------------- */

async function sendViaBrevoAPI({ from, to, subject, html, text, replyTo }) {
  const API_KEY = read("BREVO_API_KEY");
  const SENDER_EMAIL = read("BREVO_SENDER_EMAIL"); // remitente VERIFICADO en Brevo
  const SENDER_NAME = read("BREVO_SENDER_NAME", "Web");
  const RECIPIENT = to || read("BREVO_RECIPIENT");

  if (!API_KEY || !SENDER_EMAIL || !RECIPIENT) {
    throw new Error("Brevo API no configurado (BREVO_API_KEY / BREVO_SENDER_EMAIL / BREVO_RECIPIENT)");
  }

  // Si el "from" viene como "Nombre <mail@x>", usamos ese mail como replyTo
  const reply =
    replyTo ||
    (from && /<([^>]+)>/.exec(from)?.[1]) ||
    undefined;

  const payload = {
    sender: { email: SENDER_EMAIL, name: SENDER_NAME },
    to: [{ email: RECIPIENT }],
    subject: subject || "Nueva consulta",
    htmlContent: html || (text ? `<pre>${text}</pre>` : "<p>(sin contenido)</p>"),
    textContent: text || "",
    ...(reply ? { replyTo: { email: reply } } : {}),
  };

  const { signal, clear } = withTimeout(12000);
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
      },
      body: JSON.stringify(payload),
      signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Brevo API ${res.status}: ${body.slice(0, 400)}`);
    }

    const data = await res.json().catch(() => ({}));
    return { ok: true, via: "brevo_api", messageId: data?.messageId || data?.messageIds?.[0] || "brevo-api" };
  } catch (e) {
    if (e.name === "AbortError") throw new Error("Timeout Brevo API (12s)");
    throw e;
  } finally {
    clear();
  }
}

/* ---------------- SMTP (fallback) ---------------- */

function smtpOpts({ secureOverride, portOverride } = {}) {
  const secureEnv = (read("SMTP_SECURE", "false").toLowerCase() === "true");
  const secure = typeof secureOverride === "boolean" ? secureOverride : secureEnv;

  return {
    host: read("SMTP_HOST"),
    port: Number(portOverride ?? read("SMTP_PORT", "587")),
    secure, // 465=true (TLS), 587=false (STARTTLS)
    auth: { user: read("SMTP_USER"), pass: read("SMTP_PASS") },
    connectionTimeout: 12000, // espera handshake
    greetingTimeout: 8000,
    socketTimeout: 20000,
    family: Number(read("SMTP_FAMILY", "4")), // IPv4 por defecto
    tls: { minVersion: "TLSv1.2" },
  };
}

async function sendViaSMTP({ from, to, subject, html, text, replyTo }) {
  const user = read("SMTP_USER");
  const pass = read("SMTP_PASS");
  const fromEnv = read("SMTP_FROM");
  const toEnv = read("SMTP_RECIPIENT");

  if (!user || !pass || !fromEnv || !toEnv) {
    throw new Error("SMTP no configurado (SMTP_USER/PASS y SMTP_FROM/RECIPIENT)");
  }

  // Intento 1: 587 (STARTTLS) sin verify()
  try {
    const tx587 = nodemailer.createTransport(smtpOpts({ secureOverride: false, portOverride: 587 }));
    const info = await tx587.sendMail({
      from: from || fromEnv,
      to: to || toEnv,
      subject: subject || "Nueva consulta",
      html: html || (text ? `<pre>${text}</pre>` : ""),
      text: text || "",
      replyTo,
    });
    return { ok: true, via: "smtp587", messageId: info?.messageId || "smtp-587" };
  } catch (e587) {
    // Intento 2: 465 (TLS directo)
    const tx465 = nodemailer.createTransport(smtpOpts({ secureOverride: true, portOverride: 465 }));
    const info = await tx465.sendMail({
      from: from || fromEnv,
      to: to || toEnv,
      subject: subject || "Nueva consulta",
      html: html || (text ? `<pre>${text}</pre>` : ""),
      text: text || "",
      replyTo,
    });
    return { ok: true, via: "smtp465", messageId: info?.messageId || "smtp-465" };
  }
}

/* ---------------- API pública (misma firma) ---------------- */
/**
 * Mantiene la firma que ya usa tu InquiryService:
 *   sendMail(from, to, subject, html, text?, replyTo?)
 */
export const sendMail = async (from, to, subject, html, text = "", replyTo) => {
  try {
    // 1) Preferir Brevo API HTTP si hay key
    if (read("BREVO_API_KEY")) {
      try {
        return await sendViaBrevoAPI({ from, to, subject, html, text, replyTo });
      } catch (e) {
        console.error("[mailer] Brevo API error:", e?.message || e);
        // Si falla la API y hay SMTP configurado, probamos fallback
        if (!read("SMTP_HOST")) throw e;
      }
    }

    // 2) Fallback SMTP (si está configurado)
    if (read("SMTP_HOST")) {
      return await sendViaSMTP({ from, to, subject, html, text, replyTo });
    }

    // Si no hay ni API ni SMTP
    throw new Error("No hay método de envío configurado (BREVO_API_KEY o SMTP_*)");
  } catch (error) {
    console.error("[mailer] error final:", error?.message || error);
    return null; // tu service espera null para lanzar ErrorService
  }
};

export default { sendMail };

