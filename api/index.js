// api/index.js
import serverless from "serverless-http";
import app from "../backend/src/app.js"; // <--- esta es la ruta correcta

export const config = { runtime: "nodejs20.x" };
export default serverless(app);

