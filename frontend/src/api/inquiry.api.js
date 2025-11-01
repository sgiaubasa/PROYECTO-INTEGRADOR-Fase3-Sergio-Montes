import { API_URL } from "@/constants/api.constant.js";

const sendInquiry = async (values) => {
  try {
    const response = await fetch(`${API_URL}/inquiries/send-mail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    let data = null;
    try { data = await response.json(); } catch {}

    if (!response.ok) {
      throw new Error(data?.message || `Error al enviar la consulta (HTTP ${response.status})`);
    }

    return true;
  } catch (error) {
    console.error(`Error al enviar la consulta. Causa: ${error.message}`);
    throw error;
  }
};

export default { sendInquiry };
