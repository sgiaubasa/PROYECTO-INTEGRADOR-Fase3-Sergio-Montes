import cors from "cors";

// Configuración flexible de CORS para permitir peticiones desde varios orígenes
export const config = (app) => {
    const whitelist = [
        process.env.FRONTEND_HOST, // dominio de producción (Vercel)
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ].filter(Boolean); // elimina los null/undefined

    app.use(
        cors({
            origin(origin, callback) {
                // si no hay origin (por ejemplo Postman o curl), permitimos
                if (!origin) return callback(null, true);

                // si el origen está en la lista blanca, permitimos
                if (whitelist.includes(origin)) {
                    return callback(null, true);
                }

                // si no, lo bloqueamos y mostramos mensaje en consola
                console.warn(`[CORS] Bloqueado intento desde: ${origin}`);
                return callback(new Error(`CORS bloqueado para origen: ${origin}`));
            },
            methods: [ "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS" ],
            allowedHeaders: [ "Content-Type", "Authorization" ],
            credentials: true,
            optionsSuccessStatus: 204,
        }),
    );
};