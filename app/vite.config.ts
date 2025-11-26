import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    host: true,
    port: 3000,
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api/health": {
        target: process.env.VITE_HEALTH_ENDPOINT || "http://localhost:5555",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/health/, "/health"),
      },
    },
  },
});
