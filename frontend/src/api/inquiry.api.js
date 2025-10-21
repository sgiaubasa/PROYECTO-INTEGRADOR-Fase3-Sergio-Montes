import { API_URL } from "@/constants/api.constant.js";

const sendInquiry = async (values) => {
  try {
    const response = await fetch(`${API_URL}/inquiry/send-mail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    // El backend responde 204 No Content cuando sale bien
    if (response.status === 204) return true;

    // Si no es 204, intentamos leer error JSON del backend
    let data = null;
    try { data = await response.json(); } catch {}
    if (!response.ok) {
      throw new Error(data?.message || `Error al enviar la consulta (HTTP ${response.status})`);
    }

    // Por compatibilidad si algún día devolvés JSON de éxito
    if (data?.status === "success") return true;

    // Fallback
    return true;
  } catch (error) {
    console.error(`Error al enviar la consulta. Causa: ${error.message}`);
    throw error;
  }
};

export default { sendInquiry };

