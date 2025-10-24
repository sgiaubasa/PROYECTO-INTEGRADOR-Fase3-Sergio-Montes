import react from "@vitejs/plugin-react"; // 👈 reemplaza swc por babel
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["@emotion/react", "@emotion/styled"], // evita conflictos de emotion
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // backend express
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
