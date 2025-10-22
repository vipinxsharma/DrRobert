// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      ".csb.app", // ✅ allow all CodeSandbox preview URLs
      ".codesandbox.io",
    ],
    host: true, // allow external access
    port: 5173,
  },
});
