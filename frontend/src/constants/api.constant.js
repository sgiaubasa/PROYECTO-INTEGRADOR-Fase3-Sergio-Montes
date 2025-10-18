const getApiUrl = () => {
    if (import.meta.env.DEV) {
        // En desarrollo, se usa localhost
        return "http://localhost:3000/api";
    }

    // En Vercel, se usa la ruta relativa porque el backend está en el mismo dominio
    return "/api";
};

export const API_URL = getApiUrl();
export const API_URL_IMAGES = `${API_URL}/public/images`;