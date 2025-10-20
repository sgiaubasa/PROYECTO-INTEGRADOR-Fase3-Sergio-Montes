import { API_URL } from "@/constants/api.constant.js";

const sendInquiry = async (values) => {
    try {
        // 🔧 corregimos endpoint: sin "/send-mail"
        const response = await fetch(`${API_URL}/inquiry`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        // 🔍 Intentamos parsear la respuesta
        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.status !== "success") {
            throw new Error(data.message || "Error al enviar la consulta");
        }

        return true; // Éxito
    } catch (error) {
        console.error(`Error al enviar la consulta. Causa: ${error.message}`);
        throw error;
    }
};

export default {
    sendInquiry,
};
