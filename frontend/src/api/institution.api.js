import { API } from "@/constants/api.constant.js";

const fetchInstitution = async () => {
    try {
        const response = await fetch(`${API}/institutions/first`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        if (data.status === "success") {
            return data.payload;
        }

        throw new Error(data.message || "Error al obtener datos institucionales");
    } catch (error) {
        console.error("Error fetching institution:", error);
        throw error;
    }
};

export default { fetchInstitution };