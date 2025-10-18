import cors from "cors";

// Configuración de CORS para permitir peticiones desde el frontend
export const config = (app) => {
    app.use(cors({
        origin: process.env.FRONTEND_HOST,
        methods: "GET,POST,PUT,DELETE,PATCH",
    }));
};