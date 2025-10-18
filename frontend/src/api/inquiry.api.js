import { API_URL } from "@/constants/api.constant.js";

const sendInquiry = async (values) => {
    try {
        const response = await fetch(`${API_URL}/inquiry/send-mail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        if (response.status === 204) {
            return true;
        }

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al enviar la consulta");
        }

        return true;
    } catch (error) {
        console.error(`Error al enviar la consulta. Causa: ${error.message}`);
        throw error;
    }
};

export default {
    sendInquiry,
};