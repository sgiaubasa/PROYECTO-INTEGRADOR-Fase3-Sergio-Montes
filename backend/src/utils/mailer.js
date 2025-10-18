import nodemailer from "nodemailer";

// Configura el servicio SMTP: https://app.brevo.com/
const createTransport = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true para 465, false para otros puertos
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

// Verifica la conexión con el servicio SMTP
const verifyTransport = async (transport) => {
    await transport.verify();
    console.log("Conexión SMTP exitosa");
};

// Envía un correo electrónico
export const sendMail = async (from, to, subject, contentHtml) => {
    try {
        const transport = createTransport();
        await verifyTransport(transport);

        const result = await transport.sendMail({
            from,
            to,
            subject,
            html: contentHtml,
        });

        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};