// backend/src/utils/mailer.js
import nodemailer from "nodemailer";

const read = (k, d = "") => (process.env[k] ?? d)?.toString().trim();

/* Utilidad de timeout para fetch (API HTTP) */
function withTimeout(ms) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, clear: () => clearTimeout(id) };
}

/* ============ Brevo API (HTTP) con timeout ============ */
async function sendViaBrevoAPI({ from, to, subject, html, text, replyTo }) {
  const API_KEY = read("BREVO_API_KEY");
  const SENDER_EMAIL = read("BREVO_SENDER_EMAIL");     // remitente VERIFICADO en Brevo (no el @smtp-brevo.com)
  const SENDER_NAME  = read("BREVO_SENDER_NAME", "Web");
  const RECIPIENT    = to || read("BREVO_RECIPIENT");

  if (!API_KEY || !SENDER_EMAIL || !RECIPIENT) {
    throw new Error("Brevo API no configurado (BREVO_API_KEY / BREVO_SENDER_EMAIL / BREVO_RECIPIENT)");
  }

  // Si viene "Nombre <mail@x>" en from, úsalo como replyTo
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
    console.log("[BREVO] POST /v3/smtp/email …");
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
      throw new Error(`Brevo API ${res.status}: ${body.slice(0, 300)}`);
    }

    const data = await res.json();
    console.log("[BREVO] OK messageId:", data?.messageId || data?.messageIds?.[0]);
    return { messageId: data?.messageId || data?.messageIds?.[0] || "brevo-api" };
  } catch (e) {
    if (e.name === "AbortError") throw new Error("Timeout Brevo API (12s)");
    throw e;
  } finally {
    clear();
  }
}

/* ============ SMTP (fallback) ============ */
function smtpOptions({ secureOverride } = {}) {
  const secureEnv = (read("SMTP_SECURE", "false").toLowerCase() === "true");
  const secure = typeof secureOverride === "boolean" ? secureOverride : secureEnv;

  return {
    host: read("SMTP_HOST"),
    port: Number(read("SMTP_PORT", "587")),
    secure, // 465=true, 587=false (STARTTLS)
    auth: { user: read("SMTP_USER"), pass: read("SMTP_PASS") },
    connectionTimeout: 12000,
    greetingTimeout: 8000,
    socketTimeout: 20000,
    family: Number(read("SMTP_FAMILY", "4")), // IPv4
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

  // 587 → 465 fallback
  let tx = nodemailer.createTransport(smtpOptions({ secureOverride: false }));
  try {
    await tx.verify();
    console.log("[SMTP] verify OK 587");
  } catch (e) {
    console.warn("[SMTP] 587 falló, probando 465:", e?.message);
    tx = nodemailer.createTransport({ ...smtpOptions({ secureOverride: true }), port: 465 });
    await tx.verify();
    console.log("[SMTP] verify OK 465");
  }

  const info = await tx.sendMail({
    from: from || fromEnv,
    to: to || toEnv,
    subject: subject || "Nueva consulta",
    html: html || (text ? `<pre>${text}</pre>` : ""),
    text: text || "",
    replyTo,
  });

  console.log("[SMTP] enviado messageId:", info?.messageId);
  return { messageId: info?.messageId || "smtp" };
}

/* ============ API pública (MISMA FIRMA) ============ */
/** Mantiene la firma que ya usa tu InquiryService:
 *  sendMail(from, to, subject, html)
 *  (text y replyTo son opcionales)
 */
export const sendMail = async (from, to, subject, html, text = "", replyTo) => {
  try {
    if (read("BREVO_API_KEY")) {
      return await sendViaBrevoAPI({ from, to, subject, html, text, replyTo });
    }
    return await sendViaSMTP({ from, to, subject, html, text, replyTo });
  } catch (error) {
    console.error("[mailer] error:", error?.message || error);
    return null; // tu service espera null para lanzar ErrorService
  }
};

export default { sendMail };

