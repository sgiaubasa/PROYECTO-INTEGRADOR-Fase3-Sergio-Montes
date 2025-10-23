import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["@emotion/react", "@emotion/styled"], // Resuelve conflicto de paquetes de emotion
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // ⬅️ Backend de Express
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
