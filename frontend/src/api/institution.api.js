import { API_URL } from "@/constants/api.constant.js";

const fetchInstitution = async () => {
    try {
        const response = await fetch(`${API_URL}/institutions/first`);
        const data = await response.json();

        if (data.status === "success") {
            const institution = data.payload;
            return institution;
        }

        throw new Error(data.message || "Error al obtener datos institucionales");
    } catch (error) {
        console.error("Error fetching institution:", error);
        throw error;
    }
};

export default {
    fetchInstitution,
};