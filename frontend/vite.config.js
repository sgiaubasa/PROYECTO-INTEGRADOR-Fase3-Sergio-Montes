// frontend/vite.config.js
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["@emotion/react", "@emotion/styled"],
  },
  server: {
    port: 5173, // 👈 fijamos 5173 para evitar CORS en local
    proxy: {
      "/api": {
        target: "http://localhost:3000", // backend express local
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
