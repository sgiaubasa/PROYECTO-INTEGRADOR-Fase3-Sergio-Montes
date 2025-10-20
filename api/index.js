// api/index.js
import serverless from "serverless-http";
import app from "../backend/src/app.js"; // <--- esta es la ruta correcta

export const config = { runtime: "nodejs" };
export default serverless(app);

