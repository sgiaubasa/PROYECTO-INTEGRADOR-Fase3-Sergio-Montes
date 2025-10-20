// api/index.js
import serverless from "serverless-http";
import app from "../backend/app.js";

// Configuración del runtime que usa Vercel (Node 20 recomendado)
export const config = { runtime: "nodejs20.x" };

// Exportar la app Express como función serverless
export default serverless(app);
