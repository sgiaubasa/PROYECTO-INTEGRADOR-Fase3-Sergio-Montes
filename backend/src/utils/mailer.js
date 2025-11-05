// backend/src/utils/mailer.js
import nodemailer from "nodemailer";

const read = (k, d = "") => (process.env[k] ?? d)?.toString().trim();

// ======================
// Enviar con Brevo API
// ======================
async function sendViaBrevoAPI({ from, to, subject, html }) {
  const API_KEY = read("BREVO_API_KEY");
  const SENDER_EMAIL = read("BREVO_SENDER_EMAIL");
  const SENDER_NAME = read("BREVO_SENDER_NAME", "Web Form");

  if (!API_KEY || !SENDER_EMAIL) {
    throw new Error("Brevo API KEY o Sender no configurado");
  }

  const reply =
    from && /<([^>]+)>/.exec(from)?.[1]
      ? /<([^>]+)>/.exec(from)[1]
      : undefined;

  const body = {
    sender: { email: SENDER_EMAIL, name: SENDER_NAME },
    to: [{ email: to }],
    subject,
    htmlContent: html,
    ...(reply ? { replyTo: { email: reply } } : {}),
  };

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Brevo API error:", err);
    throw new Error(err);
  }

  console.log("📨 Enviado vía BREVO API");
  return res.json();
}

// ======================
// SMTP Fallback
// ======================
const createTransport = () => {
  return nodemailer.createTransport({
    host: read("SMTP_HOST"),
    port: Number(read("SMTP_PORT", 587)),
    secure: false,
    auth: {
      user: read("SMTP_USER"),
      pass: read("SMTP_PASS"),
    },
  });
};

async function sendViaSMTP({ from, to, subject, html }) {
  const transport = createTransport();
  try {
    await transport.verify();
    console.log("✅ SMTP conectado");

    return await transport.sendMail({ from, to, subject, html });
  } catch (error) {
    console.error("❌ SMTP error:", error.message);
    throw error;
  }
}

// ======================
// API Pública (tu firma original)
// ======================
export const sendMail = async (from, to, subject, html) => {
  try {
    if (read("BREVO_API_KEY")) {
      return await sendViaBrevoAPI({ from, to, subject, html });
    }

    return await sendViaSMTP({ from, to, subject, html });
  } catch (error) {
    console.error("sendMail error:", error.message);
    return null;
  }
};

export default { sendMail };
